import Head from "next/head";
import { Box, Button, CircularProgress, Grid, HStack, Stack, useColorModeValue, VStack } from "@chakra-ui/react";
import { MessageTableEntry } from "./Messages/MessageTableEntry";
import React, { useEffect, useState } from "react";
import { MessageTable } from "./Messages/MessageTable";

export const Bluetooth = () => {
	const backgroundColor2 = useColorModeValue("#DFE8F1", "#42536B");

	const [statusArr, setStatusArr] = useState<string[]>([]);
	const [devices, setDevices] = useState<BluetoothDevice[]>([]);

	let options: RequestDeviceOptions = {
		acceptAllDevices: true
	};

	const onRequestBluetoothDeviceButtonClick = async () => {
		try {
			setStatusArr([...statusArr, "Requesting any Bluetooth device..."]);
			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true
			});

			setStatusArr([...statusArr, `> Requested  ${device.name} (${device.id})]`]);
			await populateBluetoothDevices();
		} catch (error) {
			setStatusArr([...statusArr, `Argh! ${error}`]);
		}
	};

	const populateBluetoothDevices = async () => {
		try {
			setStatusArr([...statusArr, "Getting existing permitted Bluetooth devices..."]);
			const devices = await navigator.bluetooth.getDevices();

			setStatusArr([...statusArr, `> Got ${devices.length} Bluetooth devices.`]);
			setDevices(devices);
		} catch (error) {
			setStatusArr([...statusArr, `Argh! ${error}`]);
		}
	};

	const onForgetBluetoothDeviceButtonClick = async (deviceIdToForget: string) => {
		try {
			const devices = await navigator.bluetooth.getDevices();

			const device = devices.find((device) => device.id == deviceIdToForget);
			if (!device) {
				throw new Error("No Bluetooth device to forget");
			}
			setStatusArr([...statusArr, `Forgetting ${device.name} Bluetooth device...`]);
			await device.forget();

			setStatusArr([...statusArr, "> Bluetooth device has been forgotten."]);
			populateBluetoothDevices();
		} catch (error) {
			setStatusArr([...statusArr, `Argh! ${error}`]);
		}
	};

	useEffect(() => {
		populateBluetoothDevices();
		console.log(devices);
	}, []);

	return (
		<>
			<Button onClick={onRequestBluetoothDeviceButtonClick}>Connect Bluetooth Devices</Button>

			<HStack alignItems="start">
				<Box width={["100%", "100%", "100px", "2xl"]}
					 overflowY="auto"
					 maxHeight="700px"
					 className="p-4 h-full"
				>
					{devices.map((item, index) => (
						<Grid gridTemplateColumns="repeat(2, max-content)" alignItems="center" gap={6} py={4}
							  className="border-2 p-2"
							  key={item.id}>
							<Box width={["full", "full", "full", "fit-content"]}
								 p="4"
								 borderRadius="md"
								 whiteSpace="pre-wrap"
								 bg={backgroundColor2}
							>
								ID
							</Box>
							<Box>{item.id}</Box>

							<Box width={["full", "full", "full", "fit-content"]}
								 p="4"
								 borderRadius="md"
								 whiteSpace="pre-wrap"
								 bg={backgroundColor2}
							>
								Device Name
							</Box>
							<Box>{item.name}</Box>

							<Box width={["full", "full", "full", "fit-content"]}
								 p="4"
								 borderRadius="md"
								 whiteSpace="pre-wrap"
								 bg={backgroundColor2}
							>
								Status
							</Box>
							{item.gatt.connected &&
                                <Box>true</Box>
							}
							{!item.gatt.connected &&
                                <Box>false</Box>
							}
						</Grid>

					))}
				</Box>

				<Box width={["full", "full", "full", "xl"]}
					 borderRadius="md"
					 whiteSpace="pre-wrap"
					 bg={backgroundColor2}
					 className="p-4 h-full"
				>
					{statusArr.map((item, index) => (
						<Box key={index}>{item}</Box>
					))}
				</Box>
			</HStack>
		</>
	);
};