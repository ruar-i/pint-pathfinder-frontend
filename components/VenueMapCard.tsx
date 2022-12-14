import { useState } from "react";
import timeFormatter from "../helpers/timeFormatter";
import clsx from "clsx";
import { useMap } from "react-map-gl";
import { TagIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/20/solid";

interface VenueMapCardProps {
  venue: Venue;
  venuesPath: string[];
  toggleVenueInPath: (venue: string) => void;
  latLong: LatLong;
}

export default function VenueMapCard({
  venue,
  venuesPath,
  toggleVenueInPath,
  latLong,
}: VenueMapCardProps) {
  const [isOpen, setOpen] = useState(false);
  const { current: map } = useMap();

  return (
    <div>
      {isOpen && (
        <div onClick={() => setOpen(true)}>
          <div
            key={venue.name}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={"/pub-placeholder.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <p className="text-xl font-medium text-primary">
                  <a href={`venues/${venue.id}`} className="hover:underline">
                    {venue.name}
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {venue?.attributes?.map((attribute) => {
                  return (
                    <div
                      key={attribute}
                      className="bg-blue-100 p-2 rounded-md flex space-x-1"
                    >
                      <TagIcon className="w-5" />
                      <div>{attribute}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center">
                <p className="text-sm font-medium text-gray-900">
                  <a
                    href={`venues/${venue.id}`}
                    className="hover:underline"
                  ></a>
                </p>
                <div className="flex flex-col text-sm text-primary">
                  <time dateTime={venue.opening_time}>
                    Opening Time {timeFormatter(venue.opening_time)}
                  </time>
                  <time dateTime={venue.closing_time}>
                    Closing Time {timeFormatter(venue.closing_time)}
                  </time>
                </div>
              </div>
            </div>
          </div>
          {!venuesPath.includes(venue.name) ? (
            <button
              onClick={() => toggleVenueInPath(venue.name)}
              className="p-2 mt-2 w-full rounded-lg bg-blue-300 transition hover:bg-blue-400 text-lg"
            >
              Add to path
            </button>
          ) : (
            <button
              onClick={() => toggleVenueInPath(venue.name)}
              className="p-2 mt-2 w-full rounded-lg bg-red-300 transition hover:bg-red-400 text-lg"
            >
              Remove
            </button>
          )}
        </div>
      )}
      <div
        className={clsx(
          "flex justify-center text-red-400",
          venuesPath.includes(venue.name) && "text-blue-400"
        )}
        onClick={() => {
          isOpen ? setOpen(false) : setOpen(true);
          if (!isOpen && map)
            map.flyTo({ center: [latLong.long, latLong.lat] });
        }}
      >
        <MapPinIcon className="w-8" />
      </div>
    </div>
  );
}