import React, { useEffect, useState } from "react";
import { useGetVenues } from "../../hooks/queries/getVenues";
import dayjs from "dayjs";

import VenueCard from "../../components/VenueCard";
import PaginatorScrollBar from "../../components/PaginatorScrollBar";
import SearchInput from "../../components/SearchInput";
import { useGetVenuesByName } from "../../hooks/queries/getVenuesByName";
import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useDebounce } from "../../hooks/utility/useDebounce";
import { useGetUser } from "../../hooks/queries/getUser";

export default function Venues() {
  const { data: venueData } = useGetVenues();
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchTerm = useDebounce(searchParam, 500);

  const {
    data: venueSearchData,
    refetch,
    isLoading,
  } = useQuery<VenueResponse, any, any>(
    ["searchParam", debouncedSearchTerm],
    () => client.get(`name_search?name=${debouncedSearchTerm}`),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      refetch();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Venues
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Search through to find the perfect spot.
          </p>
        </div>
        <div className="pt-12">
          <SearchInput setSearchParam={setSearchParam} />
        </div>
        <div className="mx-auto pt-6 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {venueSearchData && searchParam != ""
            ? venueSearchData.data.data.map((venue: Venue, key: number) => {
                return <VenueCard venue={venue} />;
              })
            : venueData
            ? venueData.data.data.map((venue: Venue, key: number) => {
                return <VenueCard venue={venue} />;
              })
            : isLoading && <></>}
        </div>
        <div className="py-4">
          <PaginatorScrollBar />
        </div>{" "}
      </div>
    </div>
  );
}
