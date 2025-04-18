import { useCallback, useEffect, useRef, useState } from 'react';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { Avatar, Box, ButtonBase, SvgIcon } from '@mui/material';
import { useMockedUser } from '../../../hooks/use-mocked-user';
import { AccountPopover } from './account-popover';
import axios from 'axios';


const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export const AccountButton = () => {
  const user = useMockedUser();
  const anchorRef = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);

  const [admin, setAdmin] = useState(false)

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);


  const getAdmin = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': token
      }

      const response = await axios.get(`${BASEURL}/api/Dashboard/admin`, {
        headers: headers
      })

      console.log(response.data.data);
      setAdmin(response.data.data)
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAdmin()
  }, [])


  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handlePopoverOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'divider',
          height: 40,
          width: 40,
          borderRadius: '50%'
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32
          }}
        // src={user.avatar}
        >
          {/* <SvgIcon>
            <User01Icon />
          </SvgIcon> */}
        </Avatar>
      </Box>
      <AccountPopover
        admin={admin}
        anchorEl={anchorRef.current}
        onClose={handlePopoverClose}
        open={openPopover}
      />
    </>
  );
};
