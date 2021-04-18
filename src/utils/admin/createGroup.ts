import { GroupModel } from "../../data/schema/group";

export async function createGroup(): Promise<void> {
  const adminGroup = {
    name: "admin",
  };

  const exists = await GroupModel.exists({ name: adminGroup.name });

  if (!exists) {
    await GroupModel.create(adminGroup);
  }
}
