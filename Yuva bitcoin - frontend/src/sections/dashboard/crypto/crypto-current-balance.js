import PropTypes from "prop-types";
import numeral from "numeral";
//want to import string

import TrendUp02Icon from "@untitled-ui/icons-react/build/esm/TrendUp02";
import TrendDown02Icon from "@untitled-ui/icons-react/build/esm/TrendDown02";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "../../../components/chart";
import { paths } from "../../../paths";
import Link from "next/link";

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
      radialBar: {
        dataLabels: {
          show: false,
        },
        hollow: {
          size: "100%",
        },
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter(value) {
          return numeral(value).format("$0,0.00");
        },
      },
    },
  };
};
export const CryptoCurrentBalance = (props) => {
  const { chartSeries, labels } = props;
  console.log(chartSeries);
  console.log(labels);
  const chartOptions = useChartOptions(labels);
  const totalAmount = chartSeries.reduce((acc, item) => (acc += item), 0);
  const formattedTotalAmount = (
    <span>
      <img
        src="/assets/logos/yuvalogo2.png"
        alt="YB Chain Logo"
        style={{ height: "1.5rem", marginRight: "0.5rem" }}
      />
      {numeral(totalAmount).format("0,0")}
    </span>
  );

  return (
    <Card>
      <CardHeader
        title="Total Stake"
        subheader="Total coins you invested in the platform"
      />
      <CardContent>
        {chartSeries.length > 0 ? (
          <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                height: 200,
                justifyContent: "center",
                width: 200,
              }}
            >
              <Chart
                height={200}
                options={chartOptions}
                series={chartSeries}
                type="donut"
              />
            </Box>
            <Stack spacing={4} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Total Investment
                </Typography>
                <Typography variant="h4">{formattedTotalAmount}</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Total Months
                </Typography>
                <Stack
                  component="ul"
                  spacing={1}
                  sx={{
                    listStyle: "none",
                    m: 0,
                    p: 0,
                  }}
                >
                  {chartSeries.map((item, index) => {
                    const amount = numeral(item).format("0.00");

                    return (
                      <Stack
                        alignItems="center"
                        component="li"
                        direction="row"
                        key={index}
                        spacing={2}
                      >
                        <Box
                          sx={{
                            backgroundColor: chartOptions.colors[index],
                            borderRadius: "4px",
                            height: 16,
                            width: 16,
                            // fontSize: 18,
                          }}
                        />
                        <Typography sx={{ flexGrow: 1 }} variant="subtitle2">
                          {labels[index]}
                        </Typography>
                        <Typography color="text.secondary" variant="subtitle2">
                          <span>
                            <img
                              src="/assets/logos/yuvalogo2.png"
                              alt="YB Chain Logo"
                              style={{ height: "1rem", marginRight: "0.5rem" }}
                            />

                            {amount}
                          </span>
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body1">No data available</Typography>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Link href={paths.dashboard.stake.create}>
          <Button
            color="inherit"
            endIcon={
              <SvgIcon fontSize="small">
                <TrendUp02Icon />
              </SvgIcon>
            }
            size="small"
          >
            Add Investment
          </Button>
        </Link>
        {/* <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <TrendDown02Icon />
            </SvgIcon>
          )}
          size="small"
        >
          Transfer funds
        </Button> */}
      </CardActions>
    </Card>
  );
};

CryptoCurrentBalance.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};

