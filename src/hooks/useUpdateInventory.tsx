import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase/client";
import { SessionUser } from "@type/index";
import { Sale, Tenant } from "@prisma/client";
import { toast } from "sonner";

const useUpdateInventory = (tenant: Tenant | null, user?: SessionUser) => {
  const [warnings, setWarnings] = useState<string[]>([]); // State to store warnings

  useEffect(() => {
    if (!tenant || !user) return; // Ensure tenant and user are provided

    // Initialize the Supabase channel
    const channel = supabase.channel("Sales created");

    // Set up the event listener directly in the useEffect
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Sale" },
      async (payload) => {
        const newSale = payload.new as Sale;

        // Check if the tenantId of the sale matches the current tenant
        if (newSale.tenantId !== tenant.id) return;

        // Fetch the sale data including the related items and medication details
        const { data: fullSale, error } = await supabase
          .from("Sale")
          .select("*, items:SaleItem(*, medication:Medication(*))")
          .eq("id", newSale.id)
          .single();

        if (error) {
          console.error(
            "Error fetching sale with items and medication details:",
            error.message
          );
          return;
        }

        console.log(fullSale, "Sale with populated items and medication details");

        const updateInventoryPromises = fullSale.items.map(async (item) => {
          // Fetch the current quantity and threshold from the Inventory table
          const { data: inventory, error: fetchError } = await supabase
            .from("Inventory")
            .select("quantity, threshold")
            .eq("medicationId", item.medicationId)
            .eq("tenantId", fullSale.tenantId)
            .single();

          if (fetchError) {
            console.error("Error fetching inventory:", fetchError.message);
            return;
          }

          if (inventory) {
            // Calculate new quantity
            let newQuantity = inventory.quantity - item.quantity;
            let statusMessage = `Inventory update for medicationId ${item.medicationId} (${item?.medication?.name}): `;

            // Ensure the quantity is not negative
            if (newQuantity < 0) {
              newQuantity = 0; // Set to zero instead of going negative
              statusMessage += `Quantity would go negative; set to 0. `;
            }

            // If the original inventory is already less than the item quantity, set it to 0 directly
            if (inventory.quantity < item.quantity) {
              newQuantity = 0;
              statusMessage += `Original quantity less than sold quantity; set to 0. `;
            }

            // Check if new quantity is below threshold
            if (newQuantity < inventory.threshold) {
              const warningMessage = `Warning: new quantity for medication ${item?.medication?.name} (medicationId ${item.medicationId}) is below the threshold (Threshold: ${inventory.threshold}, New Quantity: ${newQuantity}).`;
              console.warn(warningMessage);
              setWarnings((prevWarnings) => [...prevWarnings, warningMessage]);
            }

            // Update the inventory with the new quantity
            const { error: updateError } = await supabase
              .from("Inventory")
              .update({ quantity: newQuantity })
              .eq("medicationId", item.medicationId)
              .eq("tenantId", fullSale.tenantId)
              .gt("quantity", 0); // Ensure the inventory quantity doesn't update to a negative value

            if (updateError) {
              console.error(
                `Error updating inventory for medication ${item?.medication?.name} (medicationId ${item.medicationId}):`,
                updateError.message
              );
            } else {
              statusMessage += `Previous Quantity: ${inventory.quantity}, New Quantity: ${newQuantity}. Inventory updated successfully.`;

              // Only show the notification if the current user did not initiate the sale
              if (newSale?.userId !== user.id) {
                toast.success(statusMessage, {
                  position: "top-right",
                });
              }
            }
          }
        });

        // Wait for all inventory updates to complete
        await Promise.all(updateInventoryPromises);

        // Show final notification to other users if the tenant matches
        if (newSale.userId !== user.id) {
          toast.success("All inventory levels updated successfully for Sale ID:", {
            position: "top-right",
          });
        }
      }
    );

    // Subscribe to the channel
    channel.subscribe();

    // Cleanup function to unsubscribe from the channel
    return () => {
      channel.unsubscribe();
    };
  }, [tenant, user, warnings]); // Re-run effect if tenant or user changes

  return { warnings, setWarnings }; // Return the warnings array for use in components
};

export default useUpdateInventory;
