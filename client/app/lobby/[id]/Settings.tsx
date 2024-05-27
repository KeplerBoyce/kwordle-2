import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Button, Slider } from "@nextui-org/react";
import { Fragment } from "react";


export default function Settings(props: {
  open: boolean,
  rounds: number,
  roundTime: number,
  preRoundTime: number,
  setOpen: (x: boolean) => void,
  setRounds: (x: number) => void,
  setRoundTime: (x: number) => void,
  setPreRoundTime: (x: number) => void,
}) {
  const {
    open,
    rounds,
    roundTime,
    preRoundTime,
    setOpen,
    setRounds,
    setRoundTime,
    setPreRoundTime,
  } = props;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => setOpen(false)} className="fixed z-10 inset-0 flex items-center justify-center">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <TransitionChild>
          <DialogPanel className="z-20">
            <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
              <h1 className="text-center text-2xl text-black mb-4 uppercase font-bold">
                Settings
              </h1>
              <div className="flex flex-col gap-4">
                <Slider
                  size="md"
                  color="foreground"
                  label="Rounds"
                  minValue={1}
                  maxValue={20}
                  defaultValue={rounds}
                  onChange={(x) => setRounds(x as number)}
                  className="uppercase font-bold"
                />
                <Slider
                  size="md"
                  color="foreground"
                  label="Round time (seconds)"
                  minValue={10}
                  maxValue={180}
                  defaultValue={roundTime}
                  step={5}
                  onChange={(x) => setRoundTime(x as number)}
                  className="uppercase font-bold"
                />
                <Slider
                  size="md"
                  color="foreground"
                  label="Time between rounds (seconds)"
                  minValue={3}
                  maxValue={15}
                  defaultValue={preRoundTime}
                  onChange={(x) => setPreRoundTime(x as number)}
                  className="uppercase font-bold"
                />
                <Button
                  size="lg"
                  radius="lg"
                  color="primary"
                  onClick={() => setOpen(false)}
                  className="uppercase font-bold text-base h-10 p-3"
                >
                  Close settings
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
