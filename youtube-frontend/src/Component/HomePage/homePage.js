import React, { useEffect, useState } from 'react';
import './homePage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = ({ sideNavbar }) => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Track the selected category

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/allVideo')
      .then((res) => {
        console.log(res.data.videos);
        setData(res.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Options for filtering
  const options = [
    "All",
    "Football",
    "Music",
    "Live",
    "Gaming",
    "Fashion",
    "Coke Studio",
    "Democracy",
    "Politics",
    "Comedy",
    "WWE",
    "Basketball",
  ];

  // Filter the data based on selected category (checks if the title contains the selected category)
  const filteredData = selectedCategory === "All"
    ? data
    : data.filter((item) =>
        item.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <div className={sideNavbar ? 'homePage' : 'fullHomePage'}>
      {/* Category Options */}
      <div className="homePage_options">
        {options.map((item, index) => (
          <div
            key={index}
            className={`homePage_option ${selectedCategory === item ? 'active' : ''}`}
            onClick={() => setSelectedCategory(item)} // Update selected category
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={sideNavbar ? "home_mainPage" : "home_mainPageWithoutLink"}>
        {filteredData.map((item, ind) => (
          <Link to={`/watch/${item._id}`} className="youtube_Video" key={ind}>
            <div className="youtube_thumbnailBox">
              <img
                src={item.thumbnail}
                alt="Thumbnail"
                className="youtube_thumbnailPic"
              />
              <div className="youtube_timingThumbnail">28.05</div>
            </div>

            <div className="youtubeTitleBox">
              <div className="youtubeTitleBoxProfile">
                <img
                  src={item?.user?.profilePic}
                  alt="profile"
                  className="youtube_thumbnail_Profile"
                />
              </div>

              <div className="youtubeTitleBox_Title">
                <div className="youtube_videoTitle">{item?.title}</div>
                <div className="youtube_channelName">{item?.user?.channelName}</div>
                <div className="youtubeVideo_views">{item?.like}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;