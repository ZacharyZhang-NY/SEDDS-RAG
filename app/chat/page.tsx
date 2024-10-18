import {Chat} from "@/components/chat";
import { AI } from '@/lib/chat/actions'
import {nanoid} from "@/lib/utils";
import {auth} from "@/auth";
import {Session} from "@/lib/types";


const Page = async () => {
  const id = nanoid()
  const session = (await auth()) as Session

  return (
    <AI initialAIState={{chatId: id, messages: []}}>
      <Chat id={id} session={session} missingKeys={[]}/>
    </AI>
  );
};

export default Page;