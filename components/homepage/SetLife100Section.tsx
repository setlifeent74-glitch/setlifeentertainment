import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { getCurrentHonorees, isSetLife100Enabled, getSectionColors } from "@/lib/queries";
import { imageFitStyle } from "@/lib/image-fit";

/** §34 Set Life 100 — Gate: explicit admin enable AND published honorees for the current list_year. */
export default async function SetLife100Section() {
  const enabled = await isSetLife100Enabled();
  if (!enabled) return null;

  const [honorees, colors] = await Promise.all([getCurrentHonorees(), getSectionColors()]);
  if (honorees.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="set100-section"
      style={colors.set_life_100 ? { backgroundColor: colors.set_life_100 } : undefined}
    >
      <span className="set100-numeral" aria-hidden="true">
        100
      </span>

      <div className="wrap">
        <div className="set100-header">
          <h2 className="headline mask-reveal"><span>THE SET LIFE 100</span></h2>
          <p>PEOPLE SHAPING THE FUTURE OF INDEPENDENT CINEMA</p>
        </div>

        <div className="set100-grid">
          {honorees.map((honoree, i) => (
            <div className="set100-portrait" key={honoree.id} style={{ transitionDelay: `${i * 60}ms` }}>
              {honoree.portrait_url && (
                <div className="set100-portrait-image">
                  <Image
                    src={honoree.portrait_url}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 45vw, 220px"
                    style={imageFitStyle(honoree.portrait_fit, honoree.portrait_position)}
                  />
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
