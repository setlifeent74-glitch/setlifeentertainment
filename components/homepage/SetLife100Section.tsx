import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { getCurrentHonorees, isSetLife100Enabled } from "@/lib/queries";

/** §34 Set Life 100 — Gate: explicit admin enable AND published honorees for the current list_year. */
export default async function SetLife100Section() {
  const enabled = await isSetLife100Enabled();
  if (!enabled) return null;

  const honorees = await getCurrentHonorees();
  if (honorees.length === 0) return null;

  return (
    <ScrollReveal as="section" className="set100-section">
      <span className="set100-numeral" aria-hidden="true">
        100
      </span>

      <div className="wrap">
        <div className="set100-header">
          <h2 className="headline">THE SET LIFE 100</h2>
          <p>PEOPLE SHAPING THE FUTURE OF INDEPENDENT CINEMA</p>
        </div>

        <div className="set100-grid">
          {honorees.map((honoree, i) => (
            <div className="set100-portrait" key={honoree.id} style={{ transitionDelay: `${i * 60}ms` }}>
              {honoree.portrait_url && (
                <div className="set100-portrait-image">
                  <Image src={honoree.portrait_url} alt="" fill sizes="(max-width: 767px) 45vw, 220px" />
                </div>
              )}
              <span className="set100-name">{honoree.name}</span>
              {honoree.title && <span className="set100-title">{honoree.title}</span>}
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
