import React, { useState } from "react";
import Header from "@/components/common/Header";
// import Button from "@/components/operations-page-operation/ui/Button";
import Button from "@/components/ui/Button";
import EditText from "@/components/ui/EditText";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { loadStripe } from "@stripe/stripe-js";

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
}

interface Deliverable {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  isLocked: boolean;
  icon: string;
}
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const ProjectDetails: React.FC = () => {
  const [isProjectDetailsExpanded, setIsProjectDetailsExpanded] =
    useState(true);
  const [messageText, setMessageText] = useState("");
  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "Dr. Amina Khalid",
      content:
        "Hello! I have reviewed your project requirements. I have some clarifying questions about the heat exchanger geometry.",
      timestamp: "2 hours ago",
      isOwn: false,
      avatar: "/images/img_mask_group.svg",
    },
    {
      id: "2",
      sender: "You",
      content:
        "Sure! The geometry specifications are in the attached PDF. Let me know if you need additional details.",
      timestamp: "1 hour ago",
      isOwn: true,
      avatar: "/images/img_mask_group_black_900.svg",
    },
  ]);

  const [participants] = useState<Participant[]>([
    {
      id: "1",
      name: "Dr. Amina Khalid",
      role: "Instructor",
      avatar: "/images/img_mask_group.svg",
      isOnline: true,
    },
    {
      id: "2",
      name: "You",
      role: "Client",
      avatar: "/images/img_mask_group_black_900.svg",
    },
  ]);

  const [deliverables] = useState<Deliverable[]>([
    {
      id: "1",
      name: "simulation_results.zip",
      size: "120 MB • Uploaded by Dr. Amina Khalid",
      uploadedBy: "Dr. Amina Khalid",
      isLocked: true,
      icon: "/images/img_div.svg",
    },
    {
      id: "2",
      name: "literature_review.pdf",
      size: "1.2 MB • Uploaded by Dr. Amina Khalid",
      uploadedBy: "Dr. Amina Khalid",
      isLocked: false,
      icon: "/images/img_div_blue_gray_700.svg",
    },
  ]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle message sending logic here
      setMessageText("");
    }
  };

  const handleCheckout = async () => {
    const res = await fetch(`${apiBaseUrl}/api/v1/payments/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: 50.54,
        email: "client@example.com",
        currency: "usd",
      }),
      credentials: "include",
    });

    const data = await res.json();
    const stripe = await stripePromise;

    if (stripe && data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    }
  };
  return (
    <div className="w-full bg-global-5 border-2 border-[#ced4da]">
      <div className="flex flex-col w-full">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <div className="w-full max-w-[90rem] mx-auto py-6">
          <div className="flex flex-col gap-6 mt-[7rem]">
            {/* Project Header Card */}
            <div className="bg-global-4 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-inter font-normal text-global-1 mb-3">
                    Heat Exchanger Optimization for MSc Thesis
                  </h1>
                  <p className="text-base font-inter font-normal text-global-5 mb-4">
                    Advanced CFD simulation and thermal analysis for academic
                    research project
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer px-3 py-1 text-sm font-inter font-normal text-global-1 bg-global-5 border border-primary rounded-[14px]"
                    >
                      MSc
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer px-3 py-1 text-sm font-inter font-normal text-global-1 bg-global-5 border border-primary rounded-[14px]"
                    >
                      CFD
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer px-3 py-1 text-sm font-inter font-normal text-global-1 bg-global-5 border border-primary rounded-[14px]"
                    >
                      Thermal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer px-3 py-1 text-sm font-inter font-normal text-global-1 bg-global-5 border border-primary rounded-[14px]"
                    >
                      APA
                    </Button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex flex-col gap-6 items-start sm:items-center">
                  <div className="text-right w-full">
                    <p className="text-sm font-inter font-normal text-global-6 mb-1">
                      Budget
                    </p>
                    <div className="flex items-baseline justify-end">
                      <span className="text-[2rem] font-inter font-semibold text-global-1">
                        1,200
                      </span>
                      <span className="text-xs font-inter font-semibold text-global-6">
                        $
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-inter font-normal text-global-6 mb-1">
                      Deadline
                    </p>
                    <p className="text-base font-inter font-normal text-global-1 mb-1">
                      Jan 15, 2025
                    </p>
                    <p className="text-xs font-inter font-normal text-global-5">
                      3 days left
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button
                  variant="outline"
                  className="cursor-pointer flex items-center bg-rose-500  justify-center gap-2 px-4 py-2 text-sm font-inter font-normal text-global-1 bg-global-5 border border-[#d4d4d4] rounded-lg"
                >
                  <img
                    src="/images/img_i.svg"
                    alt="join"
                    className="w-[14px] h-[16px]"
                  />
                  Join Meeting
                </Button>
                <Button className="cursor-pointer px-4 py-2 text-sm font-inter font-normal text-global-8 bg-global-1 rounded-lg">
                  Upload Deliverable
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Project Details */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-inter font-normal text-global-1">
                      Project Details
                    </h2>
                    <Button
                      onClick={() =>
                        setIsProjectDetailsExpanded(!isProjectDetailsExpanded)
                      }
                      className="cursor-pointer p-1"
                    >
                      <img
                        src="/images/img_arrow_down.svg"
                        alt="toggle"
                        className={`w-4 h-4 transition-transform ${
                          isProjectDetailsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {isProjectDetailsExpanded && (
                    <div className="space-y-4">
                      <p className="text-base font-inter font-normal text-global-4 leading-6">
                        This project involves comprehensive CFD analysis and
                        optimization of heat exchanger designs for MSc thesis
                        research. The work includes thermal performance
                        evaluation, pressure drop analysis, and design
                        recommendations.
                      </p>

                      <div className="mt-5">
                        <h3 className="text-base font-inter font-normal text-global-1 mb-2">
                          Requirements:
                        </h3>
                        <div className="space-y-1">
                          <p className="text-base font-inter font-normal text-global-4">
                            • ANSYS Fluent simulation setup and execution
                          </p>
                          <p className="text-base font-inter font-normal text-global-4">
                            • Thermal performance optimization
                          </p>
                          <p className="text-base font-inter font-normal text-global-4">
                            • Academic report in APA format
                          </p>
                          <p className="text-base font-inter font-normal text-global-4">
                            • Raw simulation data and results
                          </p>
                        </div>
                      </div>

                      <div className="bg-global-4 rounded-lg p-3 mt-4">
                        <p className="text-sm font-inter font-normal text-global-5 mb-2">
                          Attachments:
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="/images/img_frame_gray_600.svg"
                            alt="file"
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-inter font-normal text-global-1">
                            project_specifications.pdf
                          </span>
                          <Button className="cursor-pointer text-sm font-inter font-normal text-global-5 ml-auto">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-lg font-inter font-normal text-global-1 mb-4">
                    Milestones
                  </h2>
                  <div className="border border-primary rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-inter font-normal text-global-1 mb-1">
                          CFD Model & Initial Report
                        </h3>
                        <p className="text-sm font-inter font-normal text-global-6">
                          Due: Jan 10, 2025
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-inter font-normal text-global-1">
                          $600
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="cursor-pointer px-2 py-1 text-xs font-inter font-normal text-global-3 bg-global-3 rounded"
                        >
                          Pending Payment
                        </Button>
                        <Button
                          size="sm"
                          className="cursor-pointer px-4 py-2 text-sm font-inter font-normal text-global-8 bg-global-1 rounded-lg"
                          onClick={handleCheckout}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting & Collaborate */}
                <div className="bg-gradient-to-r from-global-4 to-global-3 border border-primary rounded-xl p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-inter font-normal text-global-1 mb-3">
                      Meeting & Collaborate
                    </h2>
                    <p className="text-base font-inter font-normal text-global-5 mb-6 max-w-2xl mx-auto">
                      Easily connect with your freelancer through a meeting to
                      share ideas, align goals, and keep the project on track.
                    </p>
                    <Button className="cursor-pointer flex items-center justify-center gap-4 px-8 py-4 text-lg font-inter font-normal text-global-8 bg-global-1 rounded-xl shadow-lg mx-auto">
                      <img
                        src="/images/img_frame_white_a700.svg"
                        alt="join"
                        className="w-5 h-[18px]"
                      />
                      Join Meeting
                    </Button>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-6">
                      <Button className="cursor-pointer text-sm font-inter font-normal text-global-5 underline">
                        Schedule new meeting
                      </Button>
                      <Button className="cursor-pointer text-sm font-inter font-normal text-global-5 underline">
                        View past meetings & recordings
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chat Section */}
                <div className="bg-global-5 border border-primary rounded-xl overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex justify-between items-center p-4 border-b border-primary">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/img_mask_group.svg"
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-base font-inter font-normal text-global-1">
                          Dr. Amina Khalid
                        </h3>
                        <p className="text-sm font-inter font-normal text-global-5">
                          Online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/img_button_gray_600.svg"
                        alt="action"
                        className="w-[30px] h-8 cursor-pointer"
                      />
                      <img
                        src="/images/img_button_gray_600_32x30.svg"
                        alt="action"
                        className="w-[30px] h-8 cursor-pointer"
                      />
                      <img
                        src="/images/img_button_gray_600_32x28.svg"
                        alt="action"
                        className="w-7 h-8 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!message.isOwn && (
                          <img
                            src={message.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                        <div
                          className={`flex flex-col gap-1 max-w-[70%] ${
                            message.isOwn ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg ${
                              message.isOwn
                                ? "bg-global-1 text-global-8"
                                : "bg-global-3 text-global-1"
                            }`}
                          >
                            <p className="text-sm font-inter font-normal leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                          <span className="text-xs font-inter font-normal text-global-6">
                            {message.timestamp}
                          </span>
                        </div>
                        {message.isOwn && (
                          <img
                            src={message.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-primary">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/img_button_gray_600_32x30.svg"
                        alt="attach"
                        className="w-[30px] h-8 cursor-pointer"
                      />
                      <img
                        src="/images/img_button_32x30.svg"
                        alt="emoji"
                        className="w-[30px] h-8 cursor-pointer"
                      />
                      <EditText
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={setMessageText}
                        className="flex-1 px-3 py-3 text-base font-inter font-normal text-global-9 bg-global-5 border border-primary rounded-lg"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="cursor-pointer p-3 bg-global-1 rounded-lg"
                      >
                        <img
                          src="/images/img_button_white_a700.svg"
                          alt="send"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Secure Deliverables */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <img
                      src="/images/img_vector.svg"
                      alt="secure"
                      className="w-[14px] h-[18px]"
                    />
                    <h2 className="text-lg font-inter font-normal text-global-1">
                      Secure Deliverables
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {deliverables.map((deliverable) => (
                      <div
                        key={deliverable.id}
                        className={`border border-primary rounded-lg p-4 ${
                          deliverable.isLocked ? "bg-global-4" : "bg-global-5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={deliverable.icon}
                              alt="file"
                              className="w-12 h-12 rounded-lg"
                            />
                            <div>
                              <h3 className="text-base font-inter font-normal text-global-1 mb-1">
                                {deliverable.name}
                              </h3>
                              <p className="text-sm font-inter font-normal text-global-6 mb-1">
                                {deliverable.size}
                              </p>
                              <span
                                className={`text-xs font-inter font-normal px-2 py-1 rounded ${
                                  deliverable.isLocked
                                    ? "text-global-3 bg-global-3"
                                    : "text-global-3 bg-global-3"
                                }`}
                              >
                                {deliverable.isLocked
                                  ? "Locked — Pay to access"
                                  : "Unlocked"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {deliverable.isLocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer px-3 py-2 text-sm font-inter font-normal text-global-2 border border-global-2 rounded-lg"
                              >
                                Pay & Unlock
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="flex items-center gap-2 px-4 py-2 text-sm font-inter font-normal text-global-8 bg-global-1 rounded-lg"
                                >
                                  <img
                                    src="/images/img_i_white_a700.svg"
                                    alt="download"
                                    className="w-[14px] h-4"
                                  />
                                  Download
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer px-4 py-2 text-sm font-inter font-normal text-global-1 border border-[#d4d4d4] rounded-lg"
                                >
                                  Accept
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full xl:w-80 flex flex-col gap-6">
                {/* Participants */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-normal text-global-1 mb-4">
                    Participants
                  </h2>
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={participant.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="text-base font-inter font-normal text-global-1">
                              {participant.name}
                            </h3>
                            <p className="text-sm font-inter font-normal text-global-6">
                              {participant.role}
                            </p>
                          </div>
                        </div>
                        <img
                          src="/images/img_button_gray_600_32x32.svg"
                          alt="options"
                          className="w-8 h-8 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone Payment */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-normal text-global-1 mb-4">
                    Milestone Payment
                  </h2>
                  <div className="border border-primary rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-inter font-normal text-global-1">
                        CFD Model & Report
                      </span>
                      <span className="text-base font-inter font-normal text-global-1">
                        $600
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-inter font-normal text-global-6">
                        Escrow Status
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer px-2 py-1 text-xs font-inter font-normal text-global-3 bg-global-3 rounded"
                      >
                        Pending
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      className="cursor-pointer w-full py-2 text-sm font-inter font-normal text-global-8 bg-global-1 rounded-lg"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-normal text-global-1 mb-4">
                    Upcoming Meetings
                  </h2>
                  <div className="bg-global-4 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-inter font-normal text-global-1">
                        Project Review
                      </h3>
                      <span className="text-sm font-inter font-normal text-global-6">
                        Tomorrow
                      </span>
                    </div>
                    <p className="text-sm font-inter font-normal text-global-5 mb-2">
                      14:00 - 15:00
                    </p>
                    <p className="text-xs font-inter font-normal text-global-6 mb-3">
                      23h 45m remaining
                    </p>
                    <Button className="cursor-pointer w-full py-2 text-sm font-inter font-normal text-global-8 bg-global-1 rounded-lg">
                      Join Meeting
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-normal text-global-1 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    <Button className="cursor-pointer flex items-center justify-start gap-3 w-full p-3 hover:bg-global-4 rounded-lg transition-colors">
                      <img
                        src="/images/img_vector_gray_600.svg"
                        alt="open"
                        className="w-4 h-4"
                      />
                      <span className="text-base font-inter font-normal text-global-1">
                        Open Request in full page
                      </span>
                    </Button>
                    <Button className="cursor-pointer flex items-center justify-start gap-3 w-full p-3 hover:bg-global-4 rounded-lg transition-colors">
                      <img
                        src="/images/img_frame_gray_600_16x14.svg"
                        alt="note"
                        className="w-[14px] h-4"
                      />
                      <span className="text-base font-inter font-normal text-global-1">
                        Add private note
                      </span>
                    </Button>
                    <Button className="cursor-pointer flex items-center justify-start gap-3 w-full p-3 hover:bg-global-4 rounded-lg transition-colors">
                      <img
                        src="/images/img_vector_blue_gray_700.svg"
                        alt="dispute"
                        className="w-[14px] h-4"
                      />
                      <span className="text-base font-inter font-normal text-global-5">
                        Raise dispute
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[90rem] w-full mt-[2rem] h-px bg-gray-300 mx-auto"></div>

        <Footer />
        {/* Footer */}
        {/* <div className="bg-global-4 py-3 mt-12">
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14 flex justify-between items-center">
            <p className="text-sm font-inter font-normal text-global-6 text-center flex-1">
              © 2025 Research Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <button className="p-4 bg-global-5 border border-[#d4d4d4] rounded-full shadow-lg">
                <img
                  src="/images/img_vector_indigo_300.svg"
                  alt="help"
                  className="w-4 h-4"
                />
              </button>
              <Button className="cursor-pointer flex items-center gap-2 px-6 py-3 text-base font-inter font-normal text-global-8 bg-global-1 rounded-3xl shadow-lg">
                <img
                  src="/images/img_i_white_a700_20x18.svg"
                  alt="join"
                  className="w-[18px] h-5"
                />
                Join Meeting
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProjectDetails;
