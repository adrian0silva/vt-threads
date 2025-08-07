
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
//import { getThreads } from "@/src/app/_data_access/thread/get-threads";
interface Params {
  forum: string;
}

export const dynamic = "force-dynamic"
const ForumDetailsPage = async ({ params: { forum } }: { params: Params }) => {
  // console.log(forum)
  // const response = await fetch(`http://localhost:3000/api/forums/${forum}`, {
  //   cache: "no-cache"
  // });
  // const { threads } = await response.json();
//  const threads = await getThreads(forum);


//  console.log(threads)
  const normalizedForum = forum.replace(/-/g, ' ').toLowerCase();

  const category = await db.category.findFirst({
    where: {
      name: {
        contains: normalizedForum,
        mode: 'insensitive',
      }
    },
  });
    console.log(category)
    if (!category?.id) {
      return []; // ou return response com erro ou mensagem
    }
    
    const threads = await db.thread.findMany({where:{category_id: category?.id}})
    console.log(threads)
    return (
      <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8">
        <div className="max-w-6xl mx-auto space-y-1">
          {threads.map((thread) => (
            <Card key={thread.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar do autor */}
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={thread.user_id || "/placeholder.svg"} alt={thread.user_id} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {thread.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
  
                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{thread.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{thread.title}</span>
                      <span>•</span>
                      <span>{thread.content}</span>
                    </div>
                  </div>
  
                  {/* Estatísticas */}
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Replies:</div>
                      <div className="text-white font-medium">{thread.category_id}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Views:</div>
                      <div className="text-white font-medium">{thread.category_id}</div>
                    </div>
                  </div>
  
                  {/* Última resposta */}
                  {/* {thread.lastReply && (
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <div className="text-gray-400">{thread.lastReply.time}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">{thread.lastReply.author}</span>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={thread.category_id || "/placeholder.svg"} alt={thread.category_id} />
                          <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {thread.category_id.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
};

export default ForumDetailsPage;
