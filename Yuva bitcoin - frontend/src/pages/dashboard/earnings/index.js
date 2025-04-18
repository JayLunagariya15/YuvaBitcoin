import { useCallback, useEffect, useRef, useState,useMemo } from 'react';
import Head from 'next/head';

import { Box, Divider, Stack, Typography } from '@mui/material';

import axios from 'axios';

import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { TaskDrawer } from '../../../sections/dashboard/order/order-drawer';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { EarningListContainer } from '../../../sections/dashboard/earnings/earning-list-container';
import { EarningListSearch } from '../../../sections/dashboard/earnings/earning-list-search';
import { EarningListTable } from '../../../sections/dashboard/earnings/earning-list-table';
import { EarningDrawer } from '../../../sections/dashboard/order copy/order-drawer';


const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

  return {
    search,
    updateSearch: setSearch
  };
};

const useOrders = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    orders: [],
    ordersCount: 0
  });

  const getOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        Authorization: token,
      }

      const response = await axios.get(`${BASEURL}/admin/getAllTasksUser`, { headers: headers });

      console.log(response.data);

      if (isMounted()) {
        setState({
          //check the response data is array or not

          orders: response.data.tasks,
          ordersCount: response.data.totalUserTasks
        });
      }
    } catch (err) {
      console.error(err);
      setState({
        orders: [],
        ordersCount: 0
      });
    }
  }, [search, isMounted]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return state;
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const { orders, ordersCount } = useOrders(search);
  const [currentTab, setCurrentTab] = useState("all");
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined
  });

  const currentEarning = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }
    return orders.find((earning) => earning.id === drawer.data);
  }, [drawer, orders]);

  usePageView();

  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);

  const handleSortChange = useCallback((sortDir) => {
    updateSearch((prevState) => ({
      ...prevState,
      sortDir
    }));
  }, [updateSearch]);

  const handlePageChange = useCallback((event, page) => {
    updateSearch((prevState) => ({
      ...prevState,
      page
    }));
  }, [updateSearch]);

  const handleRowsPerPageChange = useCallback((event) => {
    updateSearch((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  }, [updateSearch]);

  // const handleOrderOpen = useCallback((orderId) => {
  //   if (drawer.isOpen && drawer.data === orderId) {
  //     setDrawer({
  //       isOpen: false,
  //       data: undefined
  //     });
  //     return;
  //   }

  //   setDrawer({
  //     isOpen: true,
  //     data: orderId
  //   });
  // }, [drawer]);

  // const handleOrderClose = useCallback(() => {
  //   setDrawer({
  //     isOpen: false,
  //     data: undefined
  //   });
  // }, []);


  const handleOrderOpen = useCallback((earningId) => {
    if (drawer.isOpen && drawer.data === earningId) {
      setDrawer({
        isOpen: false,
        data: undefined
      });
      return;
    }

    setDrawer({
      isOpen: true,
      data: earningId
    });
  }, [drawer]);

  const handleOrderClose = useCallback(() => {
    setDrawer({
      isOpen: false,
      data: undefined
    });
  }, []);

  return (
    <>
      <Head>
        <title>
          Dashboard: Earnings | Yuva Bitcoin
        </title>
      </Head>
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <EarningListContainer open={drawer.isOpen}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    All Earnings
                  </Typography>
                </div>
              </Stack>
            </Box>
            <Divider />
            <EarningListSearch
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              sortBy={search.sortBy}
              sortDir={search.sortDir}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <Divider />
          {/*  <EarningListTable
              // onOrderSelect={handleOrderOpen}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              orders={orders}
              ordersCount={ordersCount}
              page={search.page}
              rowsPerPage={search.rowsPerPage}
        />*/}
            <EarningListTable
            onOrderSelect={handleOrderOpen} // Pass the function to handle opening drawer
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            orders={currentTab === "all" ? orders : currentTab === "pending" ? pending : currentTab === "complete" ? completed : currentTab === "rejected" ? rejected : []}
            ordersCount={ordersCount}
            page={search.page}
            rowsPerPage={search.rowsPerPage}
          />
          </EarningListContainer>
          <EarningDrawer
          // onOpen = {handleOrderOpen}
          container={rootRef.current}
          onClose={handleOrderClose}
          open={drawer.isOpen}
          order={currentEarning} // Retrieve the earning using its ID
        />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
