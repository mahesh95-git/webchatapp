"use client";
import Link from "next/link";
import React, { useEffect } from "react";

function Page() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onLoadHandler = () => {
        const body = document.querySelector("body");
        const loding = document.querySelector(".loding");
        const webContainer = document.querySelector(".web_contenar");
        const mainContainer = document.querySelector(".main_contenar");

        if (body && loding && webContainer && mainContainer) {
          body.style.backgroundColor = "white";
          loding.style.display = "none";
          webContainer.style.display = "block";
          mainContainer.style.display = "block";
          body.style.scrollBehavior = "smooth";
        }
      };

      window.onload = onLoadHandler;

      const image = document.querySelector("#laptop_image");
      const video = document.querySelector("#video");
      let color = false;

      const firstDiv = document.querySelector(".one");
      const secondDiv = document.querySelector(".two");
      const thirdDiv = document.querySelector(".three");
      const fourthDiv = document.querySelector(".four");

      const handleClick = (divToColor, otherDivs) => {
        divToColor.style.backgroundColor = color ? "#e3fdfd" : "#ace1af";
        otherDivs.forEach((div) => (div.style.backgroundColor = "#e3fdfd"));
        divToColor.style.transition = "0.7s";
        color = !color;
      };

      if (firstDiv && secondDiv && thirdDiv && fourthDiv) {
        firstDiv.addEventListener("click", () =>
          handleClick(firstDiv, [secondDiv, thirdDiv, fourthDiv])
        );
        secondDiv.addEventListener("click", () =>
          handleClick(secondDiv, [firstDiv, thirdDiv, fourthDiv])
        );
        thirdDiv.addEventListener("click", () =>
          handleClick(thirdDiv, [firstDiv, secondDiv, fourthDiv])
        );
        fourthDiv.addEventListener("click", () =>
          handleClick(fourthDiv, [firstDiv, secondDiv, thirdDiv])
        );
      }

      let i = 1;
      const intervalId = setInterval(() => {
        if (i <= 4) {
          slidesText(i);
          i += 1;
        } else {
          i = 1;
        }
      }, 2000);

      const slidesText = (i) => {
        const subMeet = document.querySelector(".sub_meet");
        if (subMeet) {
          if (i <= 2) {
            subMeet.style.marginTop = i === 2 ? "-250px" : "-100px";
          } else if (i >= 2 && i <= 4) {
            subMeet.style.marginTop = i !== 4 ? "-100px" : "0px";
          }
        }
      };

      const scrollHandler = () => {
        if (window.scrollY >= 1100) {
          image?.classList.add("scale_animation");
          video?.classList.add("scale_animation");
          document
            .querySelector(".frist_instruction")
            ?.classList.add("opposite_slied");
          document
            .querySelector(".three_instruction")
            ?.classList.add("opposite_slied");
          document
            .querySelector(".four_instructions")
            ?.classList.add("slieds_animation");
          document
            .querySelector(".second_instructions")
            ?.classList.add("slieds_animation");
          image.style.display = "block";
        }
      };

      const laptopScrollHandler = () => {
        if (window.scrollY >= 1500) {
          document.querySelector(".laptop2")?.classList.add("up_img");
          document.querySelector(".laptop1")?.classList.add("down_img");
          document.querySelector(".laptop1").style.display = "block";
          document.querySelector(".laptop2").style.display = "block";
        }
      };

      window.addEventListener("scroll", scrollHandler);
      window.addEventListener("scroll", laptopScrollHandler);

      return () => {
        window.removeEventListener("scroll", scrollHandler);
        window.removeEventListener("scroll", laptopScrollHandler);
        firstDiv?.removeEventListener("click", handleClick);
        secondDiv?.removeEventListener("click", handleClick);
        thirdDiv?.removeEventListener("click", handleClick);
        fourthDiv?.removeEventListener("click", handleClick);
        clearInterval(intervalId);
      };
    }
  }, []);

  return (
    <>
      <div className="web_contenar" id="main">
        <div className="navbar">
          <img className="image_logo" src="/COFFEE chat.png" alt="" />
          <ul className="text-[17px] navbar_list ">
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
          </ul>
          <button className="button-8" role="button">
            <Link href="/signin">Sign In</Link>
          </button>
        </div>
      </div>
      {/* topbackground Image */}
      <div className="main_contenar">
        <div className="background_contenar">
          <div className="text_section">
            <div className="inverted-3">Coffee Chat</div>
            <div className="sub_text">
              <h2>Let's Build your network</h2>
              <h2>Create acount and meet your</h2>
              <div className="meet">
                <div className="sub_meet">
                  <h1 className="name">Family</h1>
                  <h1 className="name">Friends</h1>
                  <h1 className="name">Colleagues</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="image_section">
            <img src="/chat_person.gif" alt="" />
            <img src="/laptop_img.png" alt="" />
            {/* <video src="" loop>
    </video> */}
          </div>
        </div>
        {/* Featurch Sections */}
        <div className="app_featurch">
          <div className="app_work" id="features">
            <h1 style={{ fontSize: "40px" }}>App Features</h1>
            <h2 className="text-lg">
              Coffee Chat is a real-time web chatting application designed for
              seamless communication. Key features include instant messaging,
              group chats, customizable themes, emoji support, and file sharing.
              Users can also create private or public chat rooms, ensuring a
              versatile and engaging chatting experience for everyone.
            </h2>
          </div>
          <div className="featurch">
            <div className="mobile_work">
              <div className="circle" />
              <div className="circle1" />
              <div className="circle2" />
              <img className="laptop" src="/laptop_img.png" alt="" />
              <img className="chat" src="/image.png" alt="" />
            </div>
            <div className="featurch_section">
              <div className="grop_chat">
                <div className="img">
                  <img src="/group-chat.png" alt="" />
                </div>
                <h1 className="font-bold">Group chat</h1>
                <div className="grop_info">
                  Easily create group conversations to chat, share media, and
                  collaborate with multiple people seamlessly.
                </div>
              </div>
              <div className="chat_room">
                <div className="img">
                  <img src="/chat_room.png" alt="" />
                </div>
                <h1 className="font-bold">Chat Room</h1>
                <div className="room_info">
                  Join or create public or private chat rooms for open
                  discussions or secure conversations.
                </div>
              </div>
              <div className="file_sharing">
                <div className="img">
                  <img src="/share_file.png" alt="" />
                </div>
                <h1>File Sharing</h1>
                <div className="file_info">
                  Easily share documents, images, and videos with friends or
                  groups in real-time on Coffee Chat.
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* App information */}
        <div className="app_info">
          <div className="short_info">
            <h1 style={{ fontSize: "40px" }}>
              Discover What CoffeeChat Can Do for You
            </h1>
          </div>
          <div className="chat_info center-text">
            <div className="frist_info">
              <div className="frist">
                <div className="frist_instruction">
                  <button className="one">1</button>
                  <h1>Real-time Messaging</h1>
                  <h5 className="center-text">
                    Stay connected with your friends and family through
                    real-time messaging. Send texts, photos, and more instantly.
                  </h5>
                </div>
              </div>
              <div className="thred">
                <div className="three_instruction">
                  <button className="three">3</button>
                  <h1>Voice and Video Calling</h1>
                  <h5 className="center-text">
                    Start high-quality voice or video calls directly from the
                    chat. Talk face-to-face no matter where you are.
                  </h5>
                </div>
              </div>
            </div>
            <div className="img_chat">
              <div className="round" />
              <div className="round1" />
              <div className="round2" />
              <img id="laptop_image" src="/laptop_img.png" alt="" />

              <video
                src="/video.mp4"
                autoPlay
                loop
                id="video"
                className="absolute w-[26vw]"
                muted
              />
            </div>
            <div className="second_info">
              <div className="second">
                <div className="second_instructions">
                  <button className="two">2</button>
                  <h1 className="font-bold">Group Chat</h1>
                  <h5 className="center-text">
                    Create and manage group chats for conversations with
                    multiple people. Perfect for organizing plans or staying
                    connected with family and friends.
                  </h5>
                </div>
              </div>
              <div className="fourth">
                <div className="four_instructions">
                  <button className="four">4</button>
                  <h1 className="font-bold">Media Sharing</h1>
                  <h5 className="center-text">
                    Easily share images, videos, and files directly within your
                    chats. Never miss a moment!
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Sections */}
        <div className="footer" id="about">
          <div className="services_Section">
            <div className="web_name">
              <div className="logo">
                <img src="/coffee_chat.png" alt="" />
              </div>
              <div className="discription">
                Coffee Chat is a web-based chatting application designed for
                seamless communication, fostering connections through
                user-friendly, real-time messaging.
              </div>
            </div>
            <div className="services">
              <div className="services1">
                <div className="featurchs">
                  <Link href="#about">
                  About
                  </Link>
                </div>
                <div className="security">
                <Link href="#features">
                 Feature
                  </Link>
                </div>
                <div className="">
                <Link href="#main">
                  Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="socialmedia">
            <div className="chat_building">
              Coffee Chat was founded on Oct 18, 2024
            </div>
            <div className="terms">Terms &amp; Privacy Policy</div>
            <div className="app">
              <div className="instagram">
                <div className="background">
                  {/* <i class="fa fa-instagram"></i> */}
                  <img src="/instagram.png" alt="" />
                </div>
              </div>
              <div className="Facebook">
                <div className="background">
                  {/* <i class="fa fa-instagram"></i> */}
                  <img src="/facebook.png" alt="" />
                </div>
              </div>
              <div className="Twitter">
                <div className="background">
                  {/* <i class="fa fa-instagram"></i> */}
                  <img src="/twitter.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
