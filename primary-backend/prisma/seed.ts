import {PrismaClient} from '@prisma/client';
const prismaClient = new PrismaClient();


async function main(){
    await prismaClient.availableTrigger.create({
        data: {
            id: "webhook",
            name: "Webhook",
            image: "https://static-00.iconduck.com/assets.00/webhook-icon-2048x1899-moc3mbpt.png"
        }
    })

    await prismaClient.availableAction.create({
        data: {
            id: "send-sol",
            name: "Send Solana",
            image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png"
        }
    })
    await prismaClient.availableAction.create({
        data: {
            id: "email",
            name: "Send Email",
            image: "data:image/png;base64,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"
        }
    })
}