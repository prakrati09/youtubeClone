import React, { useState, useEffect } from 'react';
import './video.css';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Video = () => {
    const [message, setMessage] = useState("");
    const [data, setData] = useState(null);
    const [videoUrl, setVideoURL] = useState("");
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [editCommentId, setEditCommentId] = useState(null); // State to track the comment being edited
    const [editCommentMessage, setEditCommentMessage] = useState(""); // State to store edited comment text
    const [showMenu, setShowMenu] = useState(null); // State for showing 3-dot menu

    const fetchVideoById = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getVideoById/${id}`);
            setData(response.data.video);
            setVideoURL(response.data.video.videoLink);
        } catch (err) {
            console.error(err);
        }
    };

    const getCommentByVideoId = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/commentApi/comment/${id}`);
            setComments(response.data.comments);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVideoById();
        getCommentByVideoId();
    }, [id]);

    const handleComment = async () => {
        const body = {
            message: message,
            video: id,
        };
        try {
            const resp = await axios.post(`http://localhost:4000/commentApi/comment`, body, { withCredentials: true });
            const newComment = resp.data.comment;
            setComments([newComment, ...comments]);
            setMessage("");
        } catch (err) {
            toast.error("Please Login First to comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:4000/commentApi/comment/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
            toast.success("Comment deleted successfully");
        } catch (err) {
            toast.error("Failed to delete comment");
        }
    };

    const handleEditComment = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/commentApi/comment/${editCommentId}`, { message: editCommentMessage });
            setComments(comments.map(comment => comment._id === editCommentId ? response.data.comment : comment));
            setEditCommentId(null);
            setEditCommentMessage("");
            toast.success("Comment updated successfully");
        } catch (err) {
            toast.error("Failed to edit comment");
        }
    };

    const toggleMenu = (commentId) => {
        setShowMenu(showMenu === commentId ? null : commentId); // Toggle menu visibility
    };

    return (
        <div className='video'>
            <div className="videoPostSection">
                <div className="video_youtube">
                    {data && (
                        <video width="400" controls autoPlay className='video_youtube_video'>
                            <source src={videoUrl} type="video/mp4" />
                            <source src={videoUrl} type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <div className="video_youtubeAbout">
                    <div className="video_uTubeTitle">{data?.title}</div>
                    <div className="youtube_video_ProfileBlock">
                        <div className="youtube_video_ProfileBlock_left">
                            <Link to={`/user/${data?.user?._id}`} className="youtube_video_ProfileBlock_left_img">
                                <img className='youtube_video_ProfileBlock_left_image' src="https://res.cloudinary.com/dezwwwtdi/image/upload/v1731193471/vxekrf2kdp9tzaojsyjt.jpg" alt="User Profile" />
                            </Link>
                            <div className="youtubeVideo_subsView">
                                <div className="youtubePostProfileName"> {data?.user?.channelName}Prakrati </div>
                                <div className="youtubePostProfileSubs">{data?.user?.createdAt}100k subscribers</div>
                            </div>
                            <div className="subscribeBtnYoutube">Subscribe</div>
                        </div>
                        <div className="youtube_video_likeBlock">
                            <div className="youtube_video_likeBlock_Like">
                                <ThumbUpOutlinedIcon />
                                <div className="youtube_video_likeBlock_NoOfLikes">{data?.like}</div>
                            </div>
                            <div className="youtubeVideoDivider"></div>
                            <div className="youtube_video_likeBlock_Like">
                                <ThumbDownAltOutlinedIcon />
                            </div>
                        </div>
                    </div>

                    <div className="youtube_video_About">
                        <div>{data?.createdAt ? data.createdAt.slice(0, 10) : 'Date not available'}</div>
                        <div>{data?.description || 'No description available'}</div>
                    </div>
                </div>

                <div className="youtubeCommentSection">
                    <div className="youtubeCommentSectionTitle">{comments.length} Comments</div>
                    <div className="youtubeSelfComment">
                        <img className="video_youtubeSelfCommentProfile" src="https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80" alt="User" />
                        <div className='addAComment'>
                            <input
                                type='text'
                                className='addAcommentInput'
                                placeholder='Add a comment'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="cancelSubmitComment">
                                <div className="cancelComment" onClick={() => setMessage("")}>Cancel</div>
                                <div className="cancelComment" onClick={handleComment}>Comment</div>
                            </div>
                        </div>
                    </div>

                    <div className="youtubeOthersComments">
                        {comments.map((item, index) => (
                            <div className="youtubeSelfComment" key={index}>
                                <img className='video_youtubeSelfCommentProfile' src={item?.user?.profilePic} alt="User Comment" />
                                <div className="others_commentSection">
                                    <div className="others_commentSectionHeader">
                                        <div className="channelName_comment">{item?.user?.channelname}</div>
                                        <div className="commentTimingOthers">
                                            {item?.createdAt ? item.createdAt.slice(0, 10) : 'Date not available'}
                                        </div>
                                        <div className="three-dots" onClick={() => toggleMenu(item._id)}>...</div>
                                        {showMenu === item._id && (
                                            <div className="comment-actions">
                                                <button onClick={() => setEditCommentId(item._id)}>Edit</button>
                                                <button onClick={() => handleDeleteComment(item._id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="otherCommentSectionComment">
                                        {editCommentId === item._id ? (
                                            <input
                                                type="text"
                                                value={editCommentMessage}
                                                onChange={(e) => setEditCommentMessage(e.target.value)}
                                                placeholder="Edit your comment"
                                            />
                                        ) : (
                                            item?.message
                                        )}
                                    </div>
                                    {editCommentId === item._id && (
                                        <button onClick={handleEditComment}>Save</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="videoSuggestions">
                Video Suggestions
                {[...Array(4)].map((_, idx) => (
                    <div className="videoSuggestionsBlock" key={idx}>
                        <div className="video_suggetion_thumbnail">
                            <img src="https://th.bing.com/th/id/OIP.8gLtXrl4KYPfPA6QyMnlUwHaEK?w=304&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" className='video_suggetion_thumbnail_img' alt="Suggestion Thumbnail" />
                        </div>
                        <div className="video_suggetions_About">
                            <div className="video_suggestion_About_title">This is a title of the video</div>
                            <div className="video_suggestion_About_channelName">Channel name</div>
                        </div>
                    </div>
                ))}
            </div>

            <ToastContainer />
        </div>
    );
};

export default Video;
