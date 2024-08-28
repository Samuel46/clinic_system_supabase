import { SaleForm } from "@/components/sales";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { supabase } from "@lib/supabase/client";
import { Sale } from "@prisma/client";
import React from "react";

async function getData(id: string) {
  const inventory = await prisma_next.inventory.findMany({
    where: {
      tenantId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
      medication: true,
    },
  });

  return { inventory };
}

function updateInventory() {
  supabase
    .channel("Sales created")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Sale" },
      async (payload) => {
        const newSale = payload.new as Sale;

        // Fetch the sale data including the related items
        const { data: fullSale, error } = await supabase
          .from("Sale")
          .select("*, items:SaleItem(*)")
          .eq("id", newSale.id)
          .single();

        if (error) {
          console.error("Error fetching sale with items:", error.message);
          return;
        }

        console.log(fullSale, "Sale with populated items");

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
            // Ensure the quantity is not negative
            let newQuantity = inventory.quantity - item.quantity;

            if (newQuantity < 0) {
              newQuantity = 0; // Set to zero instead of going negative
            }

            // If the original inventory is already less than the item quantity, set it to 0 directly
            if (inventory.quantity < item.quantity) {
              newQuantity = 0;
            }

            // Check if new quantity is below threshold, log a warning
            if (newQuantity < inventory.threshold) {
              console.warn(
                `Warning: new quantity for medicationId ${item.medicationId} is below the threshold`
              );
            }

            // Update the inventory with the new quantity
            const { error: updateError } = await supabase
              .from("Inventory")
              .update({ quantity: newQuantity })
              .eq("medicationId", item.medicationId)
              .eq("tenantId", fullSale.tenantId)
              .gt("quantity", 0); // Ensure the inventory quantity doesn't update to a negative value

            if (updateError) {
              console.error("Error updating inventory:", updateError.message);
            }
          }
        });

        // Wait for all inventory updates to complete
        await Promise.all(updateInventoryPromises);

        console.log("Inventory levels updated successfully.");
      }
    )
    .subscribe();
}
export default async function CreateSalePage() {
  const user = await getCurrentUser();

  updateInventory();

  const { inventory } = await getData(user?.tenantId!);

  const medications = inventory.map((item) => item.medication);

  return <SaleForm user={user} medications={medications} />;
}
