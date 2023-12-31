import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { loader } from "../assets";
import FundCard from "./FundCard";
import { useStateContext } from "../context";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useStateContext();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const filterByTiltle = (campaigns) => {
    return campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-black text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            {location.pathname === "/profile"
              ? "You have not created any campigns yet"
              : "No campaigns found"}
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          filterByTiltle(campaigns).map((campaign) => (
            <FundCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
