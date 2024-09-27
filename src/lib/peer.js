class WebRTCConnection {
  constructor(localStream) {
    this.localStream = localStream;
    this.remoteStream = null;
    this.peerConnection = null;
    this.candidate = null;
    this.iceServers = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
  }

  initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.iceServers);

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

  
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE State:", this.peerConnection.iceConnectionState);
    };
  }

  // Create an offer for initiating a WebRTC connection
  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }
  async sendIceCandidate() {
 if(this.candidate){

  return this.candidate
 }
  }

  async negotiationNeeded() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error during renegotiation:", error);
    }
  }

  // Set the remote description from the remote peer's offer
  async receiveOffer(offer) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
    } catch (error) {
      console.error("Error receiving offer:", error);
    }
  }

  // Create an answer in response to an offer
  async createAnswer() {
    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }

  // Set the remote description from the remote peer's answer
  async receiveAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      console.log("Received answer:", answer);
    } catch (error) {
      console.error("Error receiving answer:", error);
    }
  }

  // Add an ICE candidate received from the remote peer
  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Added ICE candidate:", candidate);
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }



  // Close connection
  closeConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
      console.log("Connection closed.");
    }
  }
}
export default WebRTCConnection;
