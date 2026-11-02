import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ArmoryGrid } from './src/components/ArmoryGrid';
import { HeroAvatarHUD } from './src/components/HeroAvatarHUD';
import { ReduxLiveInspector } from './src/components/ReduxLiveInspector';
import { StatsControlPanel } from './src/components/StatsControlPanel';
import { store } from './src/store';
import { colors } from './src/theme';

// Las 4 zonas son hermanas: ninguna recibe props de otra, todas leen del Store.
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="light" />
          <ScrollView
            contentContainerStyle={styles.content}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sticky}>
              <HeroAvatarHUD />
            </View>
            <StatsControlPanel />
            <ArmoryGrid />
            <ReduxLiveInspector />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 12, gap: 12 },
  sticky: { backgroundColor: colors.bg, paddingBottom: 4 },
});
