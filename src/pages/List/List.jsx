import { Navbar } from "../../components/Navbar/Navbar";
import "./List.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { SearchedList } from "../../components/SearchedList/SearchedList";
import { useFetch } from "../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { newSearch } from "../../context/SearchContext";

export const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [option, setOption] = useState(location.state.option);
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(9999);

  const { data, loading, error, refetchData } = useFetch();

  useEffect(() => {
    const initialQuery = `/hotel/filterHotel?city=${destination}&min=${min}&max=${max}`;
    refetchData(initialQuery);
  }, []);

  const dispatch = useDispatch();

  const handleSearchHotelDetail = () => {
    dispatch(newSearch({ dates, options: option, destination }));
    refetchData(`/hotel/filterHotel?city=${destination}&min=${min}&max=${max}`);
  };  

  return (
    <div>
      <Navbar />
      <div className="listContainer">
        <div className="listWrap">
          <div className="listSearch">
            <h1>Search</h1>
            <div className="listItem">
              <label>Destination:</label>
              <input
                onChange={(e) => setDestination(e.target.value.toLowerCase())}
                type="text"
                placeholder={destination}
              />
            </div>
            <div className="listItem">
              <label>Check-in Date:</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "dd/MM/yyyy"
              )} to ${format(dates[0].endDate, "dd/MM/yyyy")}  `}</span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDates([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  minDate={new Date()}
                  className="dates"
                />
              )}
            </div>
            <div className="listItem">
              <label>Options:</label>
              <div className="listOptionItem">
                <span className="listOptionText">
                  Min price <small>(per night)</small>
                </span>
                <input
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  type="number"
                  className="listInput"
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">
                  Max price <small>(per night)</small>
                </span>
                <input
                  value={max}
                  onChange={(e) => setMax(parseInt(e.target.value))}
                  type="number"
                  className="listInput"
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Adult</span>
                <input
                  type="number"
                  placeholder={option.adult}
                  className="listInput"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    setOption((prev) => ({ ...prev, adult: value }));
                  }}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Children</span>
                <input
                  type="number"
                  placeholder={option.childern}
                  className="listInput"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    setOption((prev) => ({ ...prev, childern: value }));
                  }}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Room</span>
                <input
                  type="number"
                  max={100}
                  value={option?.room || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    setOption((prev) => ({ ...prev, room: value }));
                  }}
                  placeholder="Enter room number"
                  className="listInput"
                />
              </div>
            </div>
            <button onClick={handleSearchHotelDetail}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : (
              <>
                {data.map((item, i) => {
                  return (
                    <div key={i}>
                      <SearchedList item={item} key={item.id} />
                    </div>
                  );
                })}
              </>
            )}
            {error &&
              <span style={{ color: "red" }}>{error.response.data.message}</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
