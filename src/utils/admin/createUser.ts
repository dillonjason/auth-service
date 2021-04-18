import config from "config";
import { GroupModel } from "../../data/schema/group";
import { UserModel } from "../../data/schema/user";
import { encrypt } from "../password";

export async function createUser(): Promise<void> {
  const adminGroup = await GroupModel.findOne({ name: "admin" });

  const adminUser = {
    username: config.get("app.admin.user") as string,
    groups: [adminGroup],
  };

  const exists = await UserModel.exists({ username: adminUser.username });

  if (!exists) {
    const password = await encrypt(config.get("app.admin.password"));
    await UserModel.create({ ...adminUser, password });
  }
}
