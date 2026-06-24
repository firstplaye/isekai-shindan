"use client";

import { motion } from "framer-motion";

interface TraitEntry {
  key: string;
  score: number;
}

interface RadarChartProps {
  traits: TraitEntry[];
  primaryTrait: string;
  secondaryTrait: string;
  maxScore: number;
}

const TRAIT_COLORS: Record<string, string> = {
  "行動力": "#ef4444",
  "論理的傾向": "#3b82f6",
  "責任感": "#f59e0b",
  "探求心": "#8b5cf6",
  "ソーシャル駆動": "#10b981",
};

const TRAIT_ICONS: Record<string, string> = {
  "行動力": "⚔️",
  "論理的傾向": "🧙",
  "責任感": "🛡️",
  "探求心": "🏹",
  "ソーシャル駆動": "💬",
};

/** 5角形の頂点座標を計算（時計回り、頂点から開始） */
function getPentagonPoints(
  cx: number,
  cy: number,
  radius: number,
  scores: number[],
  maxScore: number
): { vertices: { x: number; y: number; angle: number }[]; dataPoints: { x: number; y: number }[] } {
  const n = 5;
  const vertices: { x: number; y: number; angle: number }[] = [];
  const dataPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < n; i++) {
    // -90°（真上）から時計回り
    const angle = (-90 + i * 72) * (Math.PI / 180);
    const vx = cx + radius * Math.cos(angle);
    const vy = cy + radius * Math.sin(angle);
    vertices.push({ x: vx, y: vy, angle });

    const ratio = maxScore > 0 ? Math.min(scores[i] / maxScore, 1) : 0;
    const dx = cx + radius * ratio * Math.cos(angle);
    const dy = cy + radius * ratio * Math.sin(angle);
    dataPoints.push({ x: dx, y: dy });
  }

  return { vertices, dataPoints };
}

export default function RadarChart({
  traits,
  primaryTrait,
  secondaryTrait,
  maxScore,
}: RadarChartProps) {
  // 余白たっぷりの viewBox（ラベルが切れないように）
  const vbW = 360;
  const vbH = 340;
  const cx = vbW / 2;
  const cy = vbH / 2;
  const radius = 90;

  const scores = traits.map((t) => t.score);
  const { vertices, dataPoints } = getPentagonPoints(cx, cy, radius, scores, maxScore);

  // データポリゴンのパス
  const dataPath = dataPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ") + " Z";

  // グリッド線のパス（各レベル）
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPaths = gridLevels.map((level) => {
    const pts = vertices.map((v) => {
      const gx = cx + (v.x - cx) * level;
      const gy = cy + (v.y - cy) * level;
      return `${gx.toFixed(1)},${gy.toFixed(1)}`;
    });
    return pts.join(" ");
  });

  // 軸線
  const axisLines = vertices.map(
    (v) => `M ${cx} ${cy} L ${v.x.toFixed(1)} ${v.y.toFixed(1)}`
  );

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full max-w-[340px] h-auto"
        overflow="visible"
      >
        {/* グリッド面 */}
        {gridPaths.map((pts, i) => (
          <polygon
            key={`grid-${i}`}
            points={pts}
            fill={i === 3 ? "rgba(180,150,90,0.04)" : "none"}
            stroke="rgba(180,150,90,0.15)"
            strokeWidth="0.5"
          />
        ))}

        {/* 軸線（中心から各頂点へ） */}
        {axisLines.map((d, i) => (
          <path
            key={`axis-${i}`}
            d={d}
            stroke="rgba(180,150,90,0.1)"
            strokeWidth="0.5"
            strokeDasharray="3 4"
          />
        ))}

        {/* データポリゴン */}
        <motion.path
          d={dataPath}
          fill="rgba(180,150,90,0.15)"
          stroke="rgba(220,180,100,0.6)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* データポイント（頂点のドット） */}
        {dataPoints.map((p, i) => {
          const isPrimary = traits[i].key === primaryTrait;
          const isSecondary = traits[i].key === secondaryTrait;
          const color = TRAIT_COLORS[traits[i].key] ?? "#fff";
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={isPrimary ? 4 : isSecondary ? 3 : 2.5}
              fill={color}
              stroke={isPrimary ? "#fff" : "rgba(0,0,0,0.4)"}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }}
            />
          );
        })}

        {/* 頂点ラベル */}
        {vertices.map((v, i) => {
          const icon = TRAIT_ICONS[traits[i].key] ?? "";
          const label = traits[i].key;
          const angleRad = (-90 + i * 72) * (Math.PI / 180);
          const labelR = radius + 40;
          const lx = cx + labelR * Math.cos(angleRad);
          const ly = cy + labelR * Math.sin(angleRad);
          // 角度に応じてアンカーを切り替え
          const textAnchor = i === 0 ? "middle" : i <= 2 ? "start" : "end";

          return (
            <g key={`label-${i}`}>
              <motion.text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-amber-200/80"
                fontSize="11"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.08, duration: 0.4 }}
              >
                {icon} {label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
