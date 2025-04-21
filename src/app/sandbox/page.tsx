import { db } from "~/server/db"
import { getDriveItems } from "~/data/mockdata"
import type { DriveItem } from "~/data/mockdata"
import { folders, files } from "~/server/db/schema"

export default function SandboxPage() {

    return <div>
        Seed Function
        <form action={async () => {
            "use server"

            const driveItems = getDriveItems("/")

            try {
                await Promise.all(driveItems.map(async (item: DriveItem) => {
                    if (item.type === "folder") {
                        await db.insert(folders).values({
                            id: item.id,
                            name: item.name,
                            ownerId: item.ownerId,
                            path: item.path,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    } else {
                        await db.insert(files).values({
                            id: item.id,
                            name: item.name,
                            url: item.url ?? "#",
                            ownerId: item.ownerId,
                            path: item.path,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    }
                }))
            } catch (error) {
                console.error('Error seeding data:', error)
            }
            console.log("✅ Mock data inserted!")
        }}>
            <button type="submit">Seed</button>
        </form>
    </div>
}