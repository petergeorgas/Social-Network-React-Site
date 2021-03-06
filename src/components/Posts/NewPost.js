import React, { Component } from "react";
import ContentBlock from "../ContentBlock";
import "./css/NewPost.css";
import authService from "../../util/auth-service";
import axios from "axios";

export class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.getInitialState = this.getInitialState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addPost = this.addPost.bind(this);
  }

  getInitialState() {
    return {
      postText: "",
      invalid: false,
      errorText: "",
    };
  }

  addPost() {
    const user = authService.getCurrentUser();
    if (user) {
      const id = user.user_entry._id;

      const body = {
        posterId: id,
        content: this.state.postText,
      };

      if (this.state.postText.length > 0) {
        axios
          .post("http://localhost:3000/api/posts", body, {
            headers: authService.getAuthHeader(),
          })
          .then((res) => {
            if (res && res.status === 200) {
              this.setState({
                postText: "",
                invalid: false,
                errorText: "",
              });
              console.log("Post successfully added!");
            }
          })
          .catch((err) => {
            const res = err.response;

            if (res && res.data && res.data.name === "TokenExpiredError") {
              console.log(res);
              this.setState({
                invalid: true,
                errorText: "Your JWT has expired. Please login again.",
              });
            } else {
              console.log(err);
              this.setState({
                invalid: true,
                errorText: "There was an issue posting your message.",
              });
            }
          });
      } else {
        this.setState({
          invalid: true,
          errorText: "You cannot post an empty message!",
        });
      }
    }
  }

  handleChange(event) {
    let target = event.target;
    let value = target.value;
    this.setState({
      postText: value,
    });
  }

  render() {
    return (
      <ContentBlock>
        <h3>New Post</h3>
        <p
          className="invalidField"
          style={{ display: this.state.invalid ? "" : "" }}
        >
          {this.state.errorText}
        </p>
        <textarea
          id="newPost"
          name="newPost"
          className="formField newPostField"
          onChange={this.handleChange}
          maxLength={120}
          style={{ resize: "none" }}
          value={this.state.postText}
        />
        <div className="flex-container">
          <p className="leftItem">{this.state.postText.length}/120</p>
          <button className="postBtn rightItem" onClick={this.addPost}>
            Post
          </button>
        </div>
      </ContentBlock>
    );
  }
}

export default NewPost;
