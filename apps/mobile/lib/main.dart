import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
final routerProvider = Provider((_) => GoRouter(routes: [GoRoute(path: '/', builder: (_, __) => const Screen('Home')), GoRoute(path: '/services', builder: (_, __) => const Screen('Services')), GoRoute(path: '/booking', builder: (_, __) => const Screen('Booking')), GoRoute(path: '/login', builder: (_, __) => const Screen('Login / Register')), GoRoute(path: '/bookings', builder: (_, __) => const Screen('My Bookings')), GoRoute(path: '/booking-detail', builder: (_, __) => const Screen('Booking Detail')), GoRoute(path: '/profile', builder: (_, __) => const Screen('Profile & Preferences'))]));
void main() => runApp(const ProviderScope(child: App()));
class App extends ConsumerWidget { const App({super.key}); @override Widget build(BuildContext context, WidgetRef ref) => MaterialApp.router(title: 'Best One Services', routerConfig: ref.watch(routerProvider)); }
class Screen extends StatelessWidget { final String title; const Screen(this.title, {super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text(title)), body: Center(child: Text('$title foundation'))); }
