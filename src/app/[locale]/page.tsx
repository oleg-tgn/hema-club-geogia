import { Fragment } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Instructors from "@/components/Instructors";
import SectionObserver from "@/components/SectionObserver";

type Schedule = {
  day: string;
  rows: { weapon: string; time: string }[];
};

export const revalidate = 60;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tAbout = await getTranslations("About");
  const tTraining = await getTranslations("Training");
  const tGallery = await getTranslations("Gallery");

  const schedule: Schedule[] = [
    {
      day: tTraining("days.tuesday"),
      rows: [
        { weapon: tTraining("weapons.saber"), time: "19:00 - 20:30" },
        { weapon: tTraining("weapons.longsword"), time: "20:30 - 22:00" },
      ],
    },
    {
      day: tTraining("days.thursday"),
      rows: [
        { weapon: tTraining("weapons.saber"), time: "19:00 - 20:30" },
        { weapon: tTraining("weapons.longsword"), time: "20:30 - 22:00" },
      ],
    },
    {
      day: tTraining("days.sunday"),
      rows: [{ weapon: tTraining("weapons.mix"), time: "11:00 - 14:00" }],
    },
  ];

  const weaponsList = tTraining.raw("weaponsList") as string[];

  return (
    <>
      <Hero />

      <SectionObserver id="about" className="w-full py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{tAbout("title")}</h2>
          <p className="text-lg max-w-2xl mx-auto">{tAbout("text")}</p>
        </div>
      </SectionObserver>

      <SectionObserver id="schedule" className="w-full py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            {tTraining("title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-x-2 gap-y-6 items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {tTraining("scheduleTitle")}
              </h3>
              <table className="table-auto">
                <tbody>
                  {schedule.map((day) => (
                    <Fragment key={day.day}>
                      {day.rows.map((row, i) => (
                        <tr key={`${day.day}-${row.weapon}`}>
                          {i === 0 && (
                            <th
                              rowSpan={day.rows.length}
                              className="border px-4 py-2"
                            >
                              {day.day}
                            </th>
                          )}
                          <td className="border px-4 py-2">{row.weapon}</td>
                          <td className="border px-4 py-2">{row.time}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {tTraining("weaponsTitle")}
              </h3>
              <p className="mb-2">{tTraining("weaponsIntro")}</p>
              <ul className="list-disc pl-5">
                {weaponsList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionObserver>

      <SectionObserver id="instructors">
        <Instructors locale={locale} />
      </SectionObserver>

      <SectionObserver id="gallery" className="w-full py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">{tGallery("title")}</h2>
          <Gallery />
        </div>
      </SectionObserver>
    </>
  );
}
