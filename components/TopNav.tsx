import GlobalNav from "./GlobalNav";

/** Interior-page nav — always renders in the solid (non-overlay) §16 state. */
export default function TopNav({ active }: { active: string }) {
  return <GlobalNav activePath={active} />;
}
