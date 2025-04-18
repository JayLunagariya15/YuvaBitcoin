import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format, differenceInSeconds } from "date-fns"; // Import differenceInSeconds from date-fns
import numeral from "numeral";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "../../../../components/property-list";
import { PropertyListItem } from "../../../../components/property-list-item";
import { SeverityPill } from "../../../../components/severity-pill";
import axios from "axios";
import { useSnackbar } from "notistack";
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const statusMap = {
  canceled: "warning",
  complete: "success",
  pending: "info",
  rejected: "error",
  expired: "error",
};

export const OrderDetails = (props) => {
  const { onApprove, onEdit, onReject, order } = props;
  const [countdown, setCountdown] = useState("");
  const [linkClicked, setLinkClicked] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    updateCountdown(); // Call updateCountdown once initially
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateCountdown = () => {
    const completionTime = new Date(order.completionTime);
    const currentTime = new Date();

    // Calculate difference in seconds
    const timeDifferenceInSeconds = differenceInSeconds(completionTime, currentTime);

    if (timeDifferenceInSeconds > 0) {
      const days = Math.floor(timeDifferenceInSeconds / (24 * 60 * 60));
      const hours = Math.floor((timeDifferenceInSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((timeDifferenceInSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(timeDifferenceInSeconds % 60);

      if (days > 0) {
        setCountdown(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
      } else if (hours > 0) {
        setCountdown(`${hours} hours ${minutes} minutes ${seconds} seconds`);
      } else if (minutes > 0) {
        setCountdown(`${minutes} minutes ${seconds} seconds`);
      } else {
        setCountdown(`${seconds} seconds`);
      }
    } else {
      setCountdown("Task Expired");
    }
  };

  const handleLinkClick = () => {
    setLinkClicked(true);
  };

  const handleApprove = async () => {
    if (!linkClicked) {
      window.alert("Please visit the link and complete the task.");
    } else if (countdown === "Task Expired") {
      window.alert(
        "The task completion time has expired. You cannot submit the task."
      );
    } else {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = {
          Authorization: token,
        };

        // Send a request to the backend API to complete the task
        const response = await axios.post(
          `${BASEURL}/admin/completeTask`,
          { taskId: order.taskId },
          { headers: headers }
        );

        // Check if the request was successful
        if (response.status === 200) {
          // Task submission was successful
          setTaskCompleted(true);
          onApprove();
          enqueueSnackbar("Task submitted successfully", {
            variant: "success",
          });
          console.log("Task submitted successfully");
          // Call any additional function or update state if needed
        } else {
          // Task submission failed, handle the error
          enqueueSnackbar(response.data.message, { variant: "error" });
          console.error("Task submission failed:", response.data.message);
          // Display an error message to the user or handle it as per your application flow
        }
      } catch (error) {
        // Handle any errors that occur during the request
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        console.error("Error submitting task:", error.response.data.message);
        // Display an error message to the user or handle it as per your application flow
      }
    }
  };

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const align = lgUp ? "horizontal" : "vertical";
  const items = order.items || [];
  const statusColor =
    countdown === "Task Expired" ? statusMap.expired : statusMap[order.status];

  const totalAmount = numeral(order.totalAmount).format(
    `${order.currency}0,0.00`
  );

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Task Name"
            value={order.taskName}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Task Description "
            value={order.description}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Rewards"
            value={order.coins + " Coins"}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Task Link"
            value={
              <a
                href={order.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                {order.link}
              </a>
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Task End Time"
            value={countdown}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Task Open Time"
            value={format(new Date(order.scheduledTime), "yyyy-MM-dd HH:mm:ss")}
          />
          <PropertyListItem align={align} disableGutters divider label="Status">
            <SeverityPill color={statusColor}>
              {countdown === "Task Expired" ? "Expired" : order.status}
            </SeverityPill>
          </PropertyListItem>
        </PropertyList>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          justifyContent="flex-end"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleApprove}
            size="small"
            variant="contained"
            disabled={
              !linkClicked || taskCompleted || countdown === "Task Expired"
            }
          >
            Submit Task
          </Button>
          <Button
            color="error"
            onClick={onReject}
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
          <Typography variant="subtitle2" color="warning" sx={{ pt: 5 }}>
            Please go to the link and complete the task. If you submit without
            visiting the link, you won&apos;t receive the reward.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

OrderDetails.propTypes = {
  onApprove: PropTypes.func,
  onEdit: PropTypes.func,
  onReject: PropTypes.func,
  order: PropTypes.object,
};
