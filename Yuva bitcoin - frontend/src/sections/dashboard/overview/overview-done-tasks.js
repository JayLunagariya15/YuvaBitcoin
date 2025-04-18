import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import Link from 'next/link'; //  port Link from Next.js
import { Path } from '@react-pdf/renderer';
import { paths } from '../../../paths';

export const OverviewDoneTasks = (props) => {
  const { amount } = props;

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row'
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3
        }}
      >
        <div>
          <img
            src="/assets/iconly/iconly-glass-tick.svg"
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Completed Tasks
          </Typography>
          <Typography
            color="text.primary"
            variant="h4"
          >
            {amount}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        {/* Use Link component from Next.js to navigate to the desired route */}
        <Link  href={paths.dashboard.tasks.index}> 
          <Button
            color="inherit"
            endIcon={(
              <SvgIcon>
                <ArrowRightIcon />
              </SvgIcon>
            )}
            size="small"
          >
            See all tasks
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewDoneTasks.propTypes = {
  amount: PropTypes.number
};
