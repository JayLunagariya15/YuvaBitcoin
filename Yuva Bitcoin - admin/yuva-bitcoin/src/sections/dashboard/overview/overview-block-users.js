import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import Link from 'next/link'; // Import Next.js Link
import NextLink from 'next/link';
import { paths } from '../../../paths';

export const BlockUsers = (props) => {
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
            src="/assets/iconly/icon-glass-users.svg"
            alt= "User Icon"
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Block Users
          </Typography>
          <Typography
            color="red"
            variant="h4"
          >
            {amount}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        <Link component={NextLink} color="inherit" href={paths.dashboard.users.blocked}> {/* Use Next.js Link component */}
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          See all block users
        </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

BlockUsers.propTypes = {
  amount: PropTypes.number.isRequired
};
