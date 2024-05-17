import { Char, WordleColor } from "@/util/types";
import KeyBox from "./KeyButton";
import SpecialKeyBox from "./SpecialKeyButton";


const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export default function Keyboard(props: {
  colors: {
    [char in Char]: WordleColor
  },
  keyCallback: (char: Char) => void,
  enterCallback: () => void,
  backspaceCallback: () => void,
}) {
  const { colors, keyCallback, enterCallback, backspaceCallback } = props;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-center gap-1">
        {rows[0].map(char => <KeyBox
          key={char}
          char={char as Char}
          color={colors[char as Char]}
          callback={() => keyCallback(char as Char)}
        />)}
      </div>

      <div className="flex justify-center gap-1">
        {rows[1].map(char => <KeyBox
          key={char}
          char={char as Char}
          color={colors[char as Char]}
          callback={() => keyCallback(char as Char)}
        />)}
      </div>

      <div className="flex justify-center gap-1">
        <SpecialKeyBox text="ENTER" callback={enterCallback} />

        {rows[2].map(char => <KeyBox
          key={char}
          char={char as Char}
          color={colors[char as Char]}
          callback={() => keyCallback(char as Char)}
        />)}
        
        <SpecialKeyBox text="DELETE" callback={backspaceCallback} />
      </div>
    </div>
  );
}