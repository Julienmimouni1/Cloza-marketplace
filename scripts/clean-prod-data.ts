import 'dotenv/config';
import * as readline from 'readline';
import { prisma } from '../src/lib/prisma';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('⚠️  WARNING: This script will WIPE all PRODUCT and ORDER data from the database.');
  console.log('⚠️  WARNING: This includes clearing ALL User Carts (CartItem).');
  console.log('Users and Vendors will be PRESERVED.');
  
  rl.question('Are you sure? This will WIPE all product data. (y/n) ', async (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Aborted.');
      rl.close();
      process.exit(0);
    }

    console.log('Starting cleanup...');

    try {
      // Deletion order is critical to avoid Foreign Key Constraint violations
      const [deletedEvidence, deletedMessages, deletedDisputes, deletedOrderItems, deletedCartItems, deletedSubOrders, deletedOrders, deletedImages, deletedProducts] = await prisma.$transaction([
        // 1. Level 1 - Deep Children (Disputes)
        prisma.disputeEvidence.deleteMany(),
        prisma.disputeMessage.deleteMany(),
        
        // 2. Level 2 - Intermediates (Disputes, Line Items)
        prisma.dispute.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.cartItem.deleteMany(),
        
        // 3. Level 3 - SubOrders (Links Orders to Vendors)
        prisma.subOrder.deleteMany(),

        // 4. Level 4 - Orders (Links to Users) & Product Assets
        prisma.order.deleteMany(),
        prisma.productImage.deleteMany(),

        // 5. Level 5 - Products (Links to Vendors)
        prisma.product.deleteMany(),
      ]);

      console.log('✅ Cleanup successful!');
      console.log(`- Products: ${deletedProducts.count}`);
      console.log(`- Orders: ${deletedOrders.count}`);
      console.log(`- SubOrders: ${deletedSubOrders.count}`);
      console.log(`- Order Items: ${deletedOrderItems.count}`);
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
      rl.close();
      process.exit(0);
    }
  });
}

main();
