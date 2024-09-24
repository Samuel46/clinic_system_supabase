import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@lib/supabase/client";
import { Inventory, Prisma, Sale, Tenant } from "@prisma/client";
import { InventoryColumns, SessionUser } from "@type/index";

const useUpdateInventory = (
  tenant: Tenant | null,
  user?: SessionUser,
  data?: InventoryColumns[] // current inventory on the db
) => {
  const [warnings, setWarnings] = useState<string[]>([]); // State to store warnings
  const [currentInventories, setCurrentInventories] = useState<InventoryColumns[]>(
    data ?? []
  );

  useEffect(() => {
    if (!tenant || !user) return; // Ensure tenant and user are provided

    // Initialize the Supabase channel
    const channel = supabase.channel("Sales updated to complete:");

    // Set up the event listener directly in the useEffect
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "Sale" },
      async (payload) => {
        const newSale = payload.new as Sale;

        // Check if the tenantId of the sale matches the current tenant
        if (newSale.tenantId !== tenant.id) return;

        if (newSale.paymentStatus === "COMPLETED") {
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

          const saleWithItems = fullSale.items as unknown as Prisma.SaleItemGetPayload<{
            include: {
              medication: true;
            };
          }>[];

          const aggregatedItems = saleWithItems.reduce(
            (acc, item) => {
              const existingItem = acc.find((i) => i.medicationId === item.medicationId);
              if (existingItem) {
                existingItem.quantity += item.quantity;
              } else {
                acc.push({ ...item });
              }
              return acc;
            },
            [] as Prisma.SaleItemGetPayload<{
              include: {
                medication: true;
              };
            }>[]
          );

          const updateInventoryPromises = aggregatedItems.map(async (item) => {
            // Fetch the current quantity and threshold from the Inventory table
            const { data: inventory, error: fetchError } = await supabase
              .from("Inventory")
              .select("*, medication:Medication(*), tenant:Tenant(*)")
              .eq("medicationId", item.medicationId)
              .eq("tenantId", fullSale.tenantId)
              .single();

            console.log(inventory, "current Inventory here!!!!!");

            if (fetchError) {
              console.error("Error fetching inventory:", fetchError.message);
              return;
            }

            if (inventory) {
              // Calculate new quantity
              let newQuantity = inventory.quantity;

              // Transform the inventory data to match the table structure
              const transformedInventory = {
                id: inventory.id,
                medicationName: inventory?.medication?.name ?? "",
                tenantName: inventory?.tenant?.name ?? "",
                quantity: newQuantity,
                threshold: inventory.threshold,
                expirationDate: new Date(inventory?.expirationDate!),
                location: inventory.location,
                createdAt: new Date(inventory?.createdAt),
                updatedAt: new Date(inventory?.updatedAt),
              };

              setCurrentInventories((prevInventories) => {
                // Check if the inventory for this medication exists in the state
                const existingInventory = prevInventories.find(
                  (inv) => inv.id === transformedInventory.id
                );

                if (existingInventory) {
                  // If it exists, update the inventory entry
                  return prevInventories.map((inv) =>
                    inv.id === transformedInventory.id ? transformedInventory : inv
                  );
                } else {
                  // If it doesn't exist, add the new inventory entry
                  return [
                    ...prevInventories,
                    transformedInventory as unknown as InventoryColumns,
                  ];
                }
              });

              console.log(inventory.quantity, "inventory.quantity");
              let statusMessage = `Inventory update for medicationId ${item.medicationId} (${item?.medication?.name}): `;

              // Check if new quantity is below threshold
              if (newQuantity < inventory.threshold) {
                const warningMessage = `Warning: new quantity for medication ${item?.medication?.name} (medicationId ${item.medicationId}) is below the threshold (Threshold: ${inventory.threshold}, New Quantity: ${newQuantity}).`;
                console.warn(warningMessage);
                setWarnings((prevWarnings) => [...prevWarnings, warningMessage]);
              }

              statusMessage += `Previous Quantity: ${inventory.quantity}, New Quantity: ${newQuantity}. Inventory updated successfully.`;

              // Only show the notification if the current user did not initiate the sale
              if (newSale?.userId !== user.id) {
                toast.success(statusMessage, {
                  position: "top-right",
                });
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
      }
    );

    // Subscribe to the channel
    channel.subscribe();

    // Cleanup function to unsubscribe from the channel
    return () => {
      channel.unsubscribe();
    };
  }, [tenant, user, warnings]); // Re-run effect if tenant or user changes

  return { warnings, setWarnings, currentInventories }; // Return the warnings array for use in components
};

export default useUpdateInventory;
