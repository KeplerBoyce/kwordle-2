import { Button, Modal, ModalBody, ModalContent, ModalHeader, Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function Settings(props: {
  open: boolean,
  isHost: boolean,
  rounds: number,
  roundTime: number,
  preRoundTime: number,
  setOpen: (x: boolean) => void,
  setRounds: (x: number) => void,
  setRoundTime: (x: number) => void,
  setPreRoundTime: (x: number) => void,
  requestCallback: () => void,
}) {
  const {
    open,
    isHost,
    rounds,
    roundTime,
    preRoundTime,
    setOpen,
    setRounds,
    setRoundTime,
    setPreRoundTime,
    requestCallback,
  } = props;

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }
  }, [saved]);

  return (
    <Modal isOpen={open} onOpenChange={setOpen} isDismissable={true}>
      <ModalContent>
        {() => (<div className="flex flex-col items-center p-6">
          <ModalHeader className="text-2xl text-black p-0 mb-4 uppercase font-bold">
            Settings
          </ModalHeader>
          <ModalBody className="w-full p-0">
            {!isHost &&
              <p className="italic mb-4 text-center text-red-500">
                Only the host can edit game settings.
              </p>
            }
            <div className="flex flex-col gap-4">
              <Slider
                key={`rounds${rounds}`}
                size="md"
                color="foreground"
                label="Rounds"
                minValue={1}
                maxValue={20}
                defaultValue={rounds}
                onChangeEnd={(x) => setRounds(x as number)}
                isDisabled={!isHost}
                className="uppercase font-bold"
              />
              <Slider
                key={`roundTime${roundTime}`}
                size="md"
                color="foreground"
                label="Round time (seconds)"
                minValue={10}
                maxValue={180}
                defaultValue={roundTime}
                step={5}
                onChangeEnd={(x) => setRoundTime(x as number)}
                isDisabled={!isHost}
                className="uppercase font-bold"
              />
              <Slider
                key={`preRoundTime${preRoundTime}`}
                size="md"
                color="foreground"
                label="Time between rounds (seconds)"
                minValue={3}
                maxValue={15}
                defaultValue={preRoundTime}
                onChangeEnd={(x) => setPreRoundTime(x as number)}
                isDisabled={!isHost}
                className="uppercase font-bold"
              />
              <Button
                size="lg"
                radius="lg"
                color="primary"
                onClick={() => {
                  requestCallback();
                  setSaved(true);
                }}
                isDisabled={!isHost || saved}
                className={"uppercase font-bold text-base h-10 p-3" + (saved ? " bg-slate-400" : "")}
              >
                {saved ? "Saved!" : "Save settings"}
              </Button>
            </div>
          </ModalBody>
        </div>)}
      </ModalContent>
    </Modal>
  );
}
