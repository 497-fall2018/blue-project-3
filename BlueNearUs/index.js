/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import { Root } from "native-base";
// import { StackNavigator } from "react-navigation";
// const AppNavigator = StackNavigator(
//   {
//     Page: { screen: Page },
//   }
// );
// export default () =>
//   <Root>
//     <AppNavigator />
//   </Root>

AppRegistry.registerComponent(appName, () => App);