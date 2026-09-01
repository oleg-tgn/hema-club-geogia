import { Fragment } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import Instructors from "@/components/Instructors";

type Schedule = {
  day: string;
  rows: { weapon: string; time: string }[];
};

export const revalidate = 60;

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations("Hero");
  const tAbout = await getTranslations("About");
  const tTraining = await getTranslations("Training");
  const tGallery = await getTranslations("Gallery");
  const tContact = await getTranslations("Contact");

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
      <section
        className="text-white py-20 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {tHero("title")}
            </h1>
            <p className="text-xl mb-6">{tHero("subtitle")}</p>
            <a
              href="https://ig.me/m/st.george_hema_school"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tHero("cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{tAbout("title")}</h2>
          <p className="text-lg max-w-2xl mx-auto">{tAbout("text")}</p>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
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
      </section>

      <Instructors locale={locale} />

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{tGallery("title")}</h2>
          <Gallery />
        </div>
      </section>

      <section className="w-full">
        <div className="relative w-full h-[300px] group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d744.6156340035722!2d44.80343762855536!3d41.71053699819631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440d872b0021d1%3A0x8543fa4cb63dfe7c!2zRGFuY2Ug4YOq4YOU4YOZ4YOV4YOQIHN0dWRpbyB0YmlsaXNpIGhpcCBob3A!5e0!3m2!1sru!2sge!4v1749320896973!5m2!1sru!2sge"
            className="absolute top-0 left-0 w-full h-full pointer-events-none group-hover:pointer-events-auto"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{tContact("title")}</h2>
          <p className="mb-4">
            {tContact("address")}
            <br />
            <Image
              src="/images/inst.svg"
              alt="instagram"
              width={20}
              height={20}
              className="inline-block w-5 h-5 mr-2"
            />
            <a
              href="https://instagram.com/st.george_hema_school"
              className="text-red-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tContact("instagram")}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
