"use client";

import { EventInput } from "@fullcalendar/core/index.js";
import { useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface ShowCreatorProps {
  onCreate: (newEvents: EventInput[]) => void;
}
interface TvdbShow {
  id: number;
  name: string;
  image?: string;
  year?: string;
  overview?: string;
  episodes?: Episode[];
  averageRuntime?: number;
  totalAired?: number;
  totalUpcoming?: number;
}

type Episode = {
  seasonNumber?: number;
  number?: number;
  absoluteNumber?: number;
  isMovie?: number;
  runtime?: number | null;
  aired?: string;
};

type SeriesEpisodesResult = {
  episodes: Episode[];
  averageRuntime?: number;
  totalAired: number;
  totalUpcoming: number;
};

export default function ShowCreator({ onCreate }: ShowCreatorProps) {
  const [showName, setShowName] = useState<string>("");
  const [episodeCount, setEpisodeCount] = useState<number>();
  const [dateStart, setDateStart] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [opened, { open, close }] = useDisclosure(false);

  const [shows, setShows] = useState<TvdbShow[]>([]);
  const [activeShow, setActiveShow] = useState<TvdbShow | null>(null);

  async function handleSearch(query: string) {
    const res = await fetch(`/api/tvdb/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setShows(data.data.map(normaliseShow));
  }

  const normaliseEpisodes = (episodes: Episode[]) => {
    const mainline = episodes.filter(
      (e) => e.isMovie !== 1 && (e.seasonNumber ?? 0) > 0 && (e.number ?? 0) > 0
    );

    // If absoluteNumber is present, use it to dedupe “true” episodes
    const hasAbsolute = mainline.some((e) => (e.absoluteNumber ?? 0) > 0);
    if (!hasAbsolute) return mainline;

    const byAbs = new Map<number, Episode>();
    for (const e of mainline) {
      if ((e.absoluteNumber ?? 0) > 0 && !byAbs.has(e.absoluteNumber!)) {
        byAbs.set(e.absoluteNumber!, e);
      }
    }
    return [...byAbs.values()];
  };

  async function seriesEpisodes(
    id: number | undefined
  ): Promise<SeriesEpisodesResult> {
    if (id == undefined) {
      return {
        episodes: [],
        averageRuntime: undefined,
        totalAired: 0,
        totalUpcoming: 0,
      };
    }

    const res = await fetch(`/api/tvdb/series?id=${id}`);
    const data = await res.json();

    const episodes =
      normaliseEpisodes(data.data?.episodes ?? []);

    const averageRuntime = data.data?.averageRuntime;

    const today = new Date();
    const totalAired = episodes.filter((episode) => {
      if (!episode.aired) return false;
      const airedAt = new Date(episode.aired);
      return airedAt <= today;
    }).length;

    const totalUpcoming = Math.max(episodes.length - totalAired, 0);

    return {
      episodes,
      averageRuntime,
      totalAired,
      totalUpcoming,
    };
  }

  return (
    <div className="flex gap-3 flex-col">
      <div className="flex items-end gap-5">
        <TextInput
          label="Show Name"
          description="Enter the show's name"
          placeholder="One Piece"
          className="flex-1"
          value={showName}
          onChange={(e) => {
            setShowName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSearch(showName.trim());
          }}
        />
        <Button
          onClick={() => {
            handleSearch(showName.trim());
          }}
        >
          Search
        </Button>
      </div>
      {/* <div>
        <TextInput
          type="number"
          label="Episodes"
          description="Enter the show's episode count"
          value={episodeCount}
          onChange={(e) => {
            setEpisodeCount(Number(e.target.value || 0));
          }}
        />
      </div>
      <div>
        <label htmlFor="dateStartSelect">Date Start:</label>
        <input
          type="date"
          id="dateStartSelect"
          className="border rounded-sm ml-3"
          value={dateStart}
          onChange={(e) => {
            setDateStart(e.target.value);
          }}
        />
      </div>

      <Button
        type="button"
        className="border rounded-sm"
        onClick={() => {
          if (!showName.trim() || episodeCount <= 0 || !dateStart) {
            alert("Please fill in all fields correctly.");
            return;
          }
          onCreate(generateEvents(showName.trim(), episodeCount, dateStart));
        }}
      >
        {" "}
        Add Show
      </Button> */}
      <div className="flex flex-col gap-2">
        <Modal opened={opened} onClose={close} title={activeShow?.name}>
          <div className="flex gap-4">
            <img
              src={activeShow?.image}
              alt={`${activeShow?.name} artwork`}
              width={150}
              className="h-50"
            />
            <div className="flex flex-col gap-4">
              {activeShow?.overview}
              <div className="flex flex-col gap-1 text-sm">
                <span>Episodes: {activeShow?.episodes?.length ?? 0}</span>
                <span>Aired: {activeShow?.totalAired ?? 0}</span>
                <span>Upcoming: {activeShow?.totalUpcoming ?? 0}</span>
                <span>
                  Average Runtime:{" "}
                  {activeShow?.averageRuntime
                    ? `${activeShow.averageRuntime} min`
                    : "N/A"}
                </span>
              </div>
              <TextInput
                type="number"
                label="Episode Start"
                description="Enter the show's starting episode"
                value={episodeCount}
                onChange={(e) => {
                  setEpisodeCount(Number(e.target.value));
                }}
              />
            </div>
          </div>
        </Modal>

        {shows.map((show, index) => (
          <div key={index} className="flex h-30 gap-4 ">
            <img src={show.image} alt={`${show.name} artwork`} />
            <div className="self-center flex justify-between w-full">
              {show.name}
              <Button
                onClick={async () => {
                  const {
                    episodes,
                    averageRuntime,
                    totalAired,
                    totalUpcoming,
                  } = await seriesEpisodes(show.id);
                  const enrichedShow: TvdbShow = {
                    ...show,
                    episodes,
                    averageRuntime,
                    totalAired,
                    totalUpcoming,
                  };
                  setActiveShow(enrichedShow);
                  open();
                }}
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateEvents(
  showName: string,
  episodeCount: number,
  dateStart: string
): EventInput[] {
  const events: EventInput[] = [];
  const startDate = new Date(dateStart);

  for (let i = 0; i < episodeCount; i++) {
    const episodeDate = new Date(startDate);
    episodeDate.setDate(startDate.getDate() + i * 7); // Assuming weekly episodes

    events.push({
      title: `${showName} - Episode ${i + 1}`,
      start: episodeDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      allDay: true,
      extendedProps: {
        subtitle: `Episode ${i + 1}`,
        meta: `Season 1`,
        color: "#5D9CEC",
      },
    });
  }
  return events;
}

function normaliseShow(tvdb: any): TvdbShow {
  return {
    id: tvdb.id.split("-")[1],
    name: tvdb.translations?.eng || tvdb.name,
    image: tvdb.image_url || tvdb.thumbnail,
    year: tvdb.year || tvdb.firstAired?.split("-")[0],
    overview: tvdb.overviews?.eng || tvdb.overview,
  };
}
