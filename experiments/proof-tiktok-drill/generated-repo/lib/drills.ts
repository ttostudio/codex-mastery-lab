export type Drill = {
  id: string;
  title: string;
  topic: string;
  prompt: string;
  subtitle: string;
  answer: string;
  choices: string[];
};

export const drills: Drill[] = [
  {
    id: "accent-shadow",
    title: "英語アクセント 15秒",
    topic: "発音",
    prompt: "photograph の第一アクセントはどこ？",
    subtitle: "音声: pho-TO-graph ではなく PHO-to-graph。字幕で強勢位置を確認します。",
    answer: "PHO",
    choices: ["PHO", "TO", "GRAPH"]
  },
  {
    id: "kanji-loop",
    title: "漢字読み替え",
    topic: "国語",
    prompt: "「重複」の読みとして標準的なものは？",
    subtitle: "短い例文: 重複した行を削除する。迷ったら復習キューへ送ります。",
    answer: "ちょうふく",
    choices: ["じゅうふく", "ちょうふく", "かさふく"]
  },
  {
    id: "calc-burst",
    title: "暗算バースト",
    topic: "数学",
    prompt: "18 x 7 は？",
    subtitle: "10 x 7 と 8 x 7 に分ける。70 + 56 で答えを作ります。",
    answer: "126",
    choices: ["116", "126", "136"]
  }
];

export function nextIndex(current: number, direction: 1 | -1) {
  return (current + direction + drills.length) % drills.length;
}

export function gradeAnswer(drill: Drill, choice: string) {
  return drill.answer === choice;
}
