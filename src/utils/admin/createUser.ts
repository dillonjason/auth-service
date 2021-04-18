import config from "config";
import { GroupModel } from "../../data/schema/group";
import { UserModel } from "../../data/schema/user";

export async function createUser(): Promise<void> {
  const adminGroup = await GroupModel.findOne({ name: "admin" });

  const adminUser = {
    username: config.get("app.admin.user") as string,
    password: config.get("app.admin.password"),
    groups: [adminGroup],
  };

  const exists = await UserModel.exists({ username: adminUser.username });

  if (!exists) {
    await UserModel.create(adminUser);
  }
}
