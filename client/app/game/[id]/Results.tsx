import { Result } from "@/util/types";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";


export default function Results(props: {
  open: boolean,
  setOpen: (x: boolean) => void,
  results: {
    [userId: string]: Result,
  },
  myId: string,
}) {
  const { open, setOpen, results, myId } = props;

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      isDismissable={true}
      className="max-w-full w-min"
    >
      <ModalContent>
        {() => (<div className="flex flex-col items-center p-6">
          <ModalHeader className="text-2xl text-black p-0 mb-4 uppercase font-bold">
            Results
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="rounded-xl bg-white border-3 border-slate-300 flex flex-col
                divide-y-3 divide-slate-300 overflow-hidden">
              <div className="bg-slate-200 flex uppercase font-bold divide-x-3 divide-slate-300">
                <p className="w-16 px-2 py-1 text-center">
                  Rank
                </p>
                <p className="w-24 px-2 py-1 text-center">
                  Player
                </p>
                <p className="w-24 px-2 py-1 text-center">
                  Score
                </p>
                <p className="w-36 px-2 py-1 text-center">
                  Avg. guesses
                </p>
                <p className="flex-grow whitespace-nowrap px-2 py-1 text-center">
                  Round ranks
                </p>
              </div>

              {Object.keys(results).sort((a, b) => results[b].score - results[a].score).map((userId, i) =>
                <div key={i} className={"flex divide-x-3 divide-slate-300 "
                  + (myId === userId ? "bg-sky-100" : "bg-transparent")
                }>
                  <p className={"w-16 px-2 py-1 font-semibold "
                    + (i === 0 ? "text-amber-400 font-bold"
                    : (i === 1 ? "text-gray-400 font-bold"
                    : (i === 2 ? "text-amber-700 font-bold" : "text-slate-400")))
                  }>
                    {`${i + 1}${i === 0 ? "st" : (i === 1 ? "nd" : (i === 2 ? "rd" : "th"))}`}
                  </p>
                  <p className="w-24 px-2 py-1 font-semibold">
                    {results[userId].username}
                  </p>
                  <p className="w-24 px-2 py-1 text-wordle-green font-bold text-center">
                    {results[userId].score}
                  </p>
                  <p className="w-36 px-2 py-1 font-bold text-center">
                    {results[userId].numGuesses.filter((_, i) => results[userId].solves[i]).length > 0
                      ? (results[userId].numGuesses.filter((_, i) => results[userId].solves[i])
                        .reduce((a, b) => a + b) / results[userId].numGuesses.filter((_, i) =>
                          results[userId].solves[i]).length).toFixed(2)
                      : 0}
                  </p>
                  <div className="w-min flex divide-x-3 divide-slate-300">
                    {results[userId].numGuesses.map((_, i) =>
                      <div key={i} className="w-16 flex gap-1 items-center">
                        {(results[userId].solves[i] === false)
                          ? <p className="w-full text-red-500 text-center px-2 py-1 font-bold">
                            —
                          </p>
                          : <p className={"w-full text-center px-2 py-1 "
                            + (results[userId].ranks[i] === 1 ? "text-amber-400 font-bold"
                            : (results[userId].ranks[i] === 2 ? "text-gray-400 font-bold"
                            : (results[userId].ranks[i] === 3 ? "text-amber-700 font-bold" : "text-slate-400")))
                          }>
                            {`${results[userId].ranks[i]}${results[userId].ranks[i] === 1 ? "st" :
                              (results[userId].ranks[i] === 2 ? "nd" :
                              (results[userId].ranks[i] === 3 ? "rd" : "th"))}`}
                          </p>
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        </div>)}
      </ModalContent>
    </Modal>
  );
}
