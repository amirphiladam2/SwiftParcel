import React, { useRef, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lottie from 'lottie-react-native';

const { width, height } = Dimensions.get('window');


type SlideItem = {
  id: string;
  lottie: any;
  title: string;
  subtitle: string;
};

const SLIDES: SlideItem[] = [
  { id: '1', lottie: require('../assets/animations/Online Shopping.json'), title: 'MoneyMap', subtitle: 'Your best path to smarter spending.' },
  { id: '2', lottie: require('../assets/animations/ecommerce.json'), title: 'FinMake', subtitle: 'Track, save and grow with ease.' },
  { id: '3', lottie: require('../assets/animations/Shopping bag.json'), title: 'CashLens', subtitle: 'Clarity for every penny.' },
];

// 2. Sub-components (Plain functions)
const Slide = ({ item }: { item: SlideItem }) => (
  <View style={{ width }} className="items-center justify-center">
    <Lottie
      source={item.lottie}
      style={{ height: '70%', width: '100%' }}
      autoPlay
      loop
      resizeMode="contain"
    />
    <View className="px-10">
      <Text className="text-black text-3xl font-bold text-center">{item.title}</Text>
      <Text className="text-black/70 text-base mt-3 text-center leading-6">{item.subtitle}</Text>
    </View>
  </View>
);

const Indicators = ({ currentIndex }: { currentIndex: number }) => (
  <View className="flex-row justify-center items-center h-5">
    {SLIDES.map((_, index) => (
      <View
        key={index}
        className={`h-1.5 mx-1 rounded-full ${
          currentIndex === index ? 'bg-primary w-6' : 'bg-primary/20 w-2'
        }`}
      />
    ))}
  </View>
);

// 3. Main Component
export default function OnboardingScreen() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  const isLastSlide = currentSlideIndex === SLIDES.length - 1;

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    setCurrentSlideIndex(index);
  }, []);

  const scrollTo = (index: number) => {
    flatListRef.current?.scrollToOffset({ offset: index * width, animated: true });
  };

  const handleNext = () => 
    isLastSlide ? router.replace('/(tabs)/home') : scrollTo(currentSlideIndex + 1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f7efea" />
      
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} />}
      />

      <View style={{ height: height * 0.2 }} className="px-6 justify-between pb-10">
        <Indicators currentIndex={currentSlideIndex} />

        <View className="flex-row gap-4">
          {!isLastSlide && (
            <TouchableOpacity 
              onPress={() => scrollTo(SLIDES.length - 1)}
              className="flex-1 h-14 items-center justify-center rounded-2xl border border-black/10"
            >
              <Text className="font-semibold text-primary">SKIP</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={handleNext}
            activeOpacity={0.8}
            className="flex-1 h-14 bg-primary items-center justify-center rounded-2xl"
          >
            <Text className="font-bold text-white tracking-widest">
              {isLastSlide ? 'GET STARTED' : 'NEXT'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}