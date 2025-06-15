import CartPage from "@/components/CartPage";
import { getCurrentClientSideUser } from "@/data_access/user";

const page = async () => {
  let user = null;

  try {
    user = await getCurrentClientSideUser();
  } catch (error) {}

  return <CartPage user={user} />;
};

export default page;
