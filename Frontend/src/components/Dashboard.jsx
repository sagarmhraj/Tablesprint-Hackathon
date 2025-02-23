import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Image
        src="/tablesprint_logo.png"
        alt="Tablesprint Logo"
        mb={0}
        objectFit="contain"
      />
      <Text fontSize="xl " fontWeight="bold" textAlign="center">
        Welcome to Tablesprint Admin
      </Text>
    </Box>
  );
};

export default Dashboard;