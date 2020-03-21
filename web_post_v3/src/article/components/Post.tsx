import React, { FC, memo } from "react";
import { reply, showActivity } from "../utils/jsapi";
import { IPost } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "..";

export interface IActionPost {
  title: string;
  author: string;
  nick: string;
  pid: number;
  board: {
    name: string;
  };
  content: string;
}

const Post: FC<{
  post: IPost;
  p: number;
}> = memo(({ post: { author, nick, dateString, content, floor, pid }, p }) => {
  const mainPost = useSelector((state: RootState) => state.group.mainPost);
  function makeActionPost() {
    const actionPost: IActionPost = {
      title: mainPost.title,
      author,
      nick,
      pid,
      board: {
        name: mainPost.board
      },
      content: content!
        .replace(/<br\/?>/g, "\n")
        .replace(/<.*?>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
    };
    console.log("actionPost", actionPost);
    return actionPost;
  }
  function doReply() {
    reply(makeActionPost());
  }
  function doActivity() {
    showActivity(makeActionPost());
  }
  return (
    <div className="post" data-page={p} data-floor={floor}>
      <div className="post-title">
        <div>
          {author}
          {nick!.length > 0 ? `(${nick})` : ``}
        </div>
        <div className="post-info">
          <span className="floor">{floor === 0 ? "楼主" : `${floor}楼`}</span>
          <span className="date">{dateString}</span>
        </div>
        <div className="post-action">
          <div className="action replay skip-scroll" onClick={doReply}>
            回复
          </div>
          <div className="action more skip-scroll" onClick={doActivity}>
            ···
          </div>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content || "" }}></div>
    </div>
  );
});

export default Post;
