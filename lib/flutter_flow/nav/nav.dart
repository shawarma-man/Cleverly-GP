import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:page_transition/page_transition.dart';
import '../flutter_flow_theme.dart';

import '../../index.dart';
import '../../main.dart';
import '../lat_lng.dart';
import '../place.dart';
import 'serialization_util.dart';

export 'package:go_router/go_router.dart';
export 'serialization_util.dart';

const kTransitionInfoKey = '__transition_info__';

class AppStateNotifier extends ChangeNotifier {
  bool showSplashImage = true;

  void stopShowingSplashImage() {
    showSplashImage = false;
    notifyListeners();
  }
}

GoRouter createRouter(AppStateNotifier appStateNotifier) => GoRouter(
      initialLocation: '/',
      debugLogDiagnostics: true,
      refreshListenable: appStateNotifier,
      errorBuilder: (context, _) => appStateNotifier.showSplashImage
          ? Builder(
              builder: (context) => Container(
                color: FlutterFlowTheme.of(context).white,
                child: Center(
                  child: Image.asset(
                    'assets/images/animation_500_lcs2rcc1.gif',
                    width: MediaQuery.of(context).size.width * 0.8,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            )
          : AuthScreenWidget(),
      routes: [
        FFRoute(
          name: '_initialize',
          path: '/',
          builder: (context, _) => appStateNotifier.showSplashImage
              ? Builder(
                  builder: (context) => Container(
                    color: FlutterFlowTheme.of(context).white,
                    child: Center(
                      child: Image.asset(
                        'assets/images/animation_500_lcs2rcc1.gif',
                        width: MediaQuery.of(context).size.width * 0.8,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                )
              : AuthScreenWidget(),
          routes: [
            FFRoute(
              name: 'authScreen',
              path: 'authScreen',
              builder: (context, params) => AuthScreenWidget(
                email: params.getParam('email', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'forgot',
              path: 'forgot',
              builder: (context, params) => ForgotWidget(
                email: params.getParam('email', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'profile',
              path: 'profile',
              builder: (context, params) => ProfileWidget(
                token: params.getParam('token', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'courseDetails',
              path: 'courseDetails',
              builder: (context, params) => CourseDetailsWidget(
                courseDetails:
                    params.getParam('courseDetails', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'pinCode',
              path: 'pinCode',
              builder: (context, params) => PinCodeWidget(
                email: params.getParam('email', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'Home',
              path: 'home',
              builder: (context, params) => params.isEmpty
                  ? NavBarPage(initialPage: 'Home')
                  : HomeWidget(
                      user: params.getParam('user', ParamType.String),
                    ),
            ),
            FFRoute(
              name: 'editProfile',
              path: 'editProfile',
              builder: (context, params) => EditProfileWidget(),
            ),
            FFRoute(
              name: 'success',
              path: 'success',
              builder: (context, params) => SuccessWidget(
                message: params.getParam('message', ParamType.String),
                courseDetails:
                    params.getParam('courseDetails', ParamType.String),
                isCourse: params.getParam('isCourse', ParamType.bool),
              ),
            ),
            FFRoute(
              name: 'resetPass',
              path: 'resetPass',
              builder: (context, params) => ResetPassWidget(
                email: params.getParam('email', ParamType.String),
                token: params.getParam('token', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'cardDetails',
              path: 'cardDetails',
              builder: (context, params) => CardDetailsWidget(),
            ),
            FFRoute(
              name: 'personalTab',
              path: 'personalTab',
              builder: (context, params) => params.isEmpty
                  ? NavBarPage(initialPage: 'personalTab')
                  : PersonalTabWidget(),
            ),
            FFRoute(
              name: 'quiz',
              path: 'quiz',
              builder: (context, params) => QuizWidget(
                quizId: params.getParam('quizId', ParamType.String),
                courseId: params.getParam('courseId', ParamType.String),
                answers: params.getParam('answers', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'Video',
              path: 'video',
              builder: (context, params) => VideoWidget(
                videoDetails: params.getParam('videoDetails', ParamType.JSON),
              ),
            ),
            FFRoute(
              name: 'cart',
              path: 'cart',
              builder: (context, params) => params.isEmpty
                  ? NavBarPage(initialPage: 'cart')
                  : CartWidget(),
            ),
            FFRoute(
              name: 'paymentSuccess',
              path: 'paymentSuccess',
              builder: (context, params) => PaymentSuccessWidget(
                total: params.getParam('total', ParamType.String),
                cardnum: params.getParam('cardnum', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'search',
              path: 'search',
              builder: (context, params) => SearchWidget(
                searchTerm: params.getParam('searchTerm', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'addVideo',
              path: 'addVideo',
              builder: (context, params) => AddVideoWidget(
                courseId: params.getParam('courseId', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'changePass',
              path: 'changePass',
              builder: (context, params) => ChangePassWidget(
                email: params.getParam('email', ParamType.String),
                token: params.getParam('token', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'addQuiz',
              path: 'addQuiz',
              builder: (context, params) => AddQuizWidget(
                courseId: params.getParam('courseId', ParamType.String),
                quizId: params.getParam('quizId', ParamType.String),
                name: params.getParam('name', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'quizReview',
              path: 'quizReview',
              builder: (context, params) => QuizReviewWidget(
                name: params.getParam('name', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'editCourse',
              path: 'editCourse',
              builder: (context, params) => EditCourseWidget(
                courseId: params.getParam('courseId', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'quizReviewScore',
              path: 'quizReviewScore',
              builder: (context, params) => QuizReviewScoreWidget(
                quizId: params.getParam('quizId', ParamType.String),
                courseId: params.getParam('courseId', ParamType.String),
                answers: params.getParam('answers', ParamType.JSON),
              ),
            ),
            FFRoute(
              name: 'myLearning',
              path: 'myLearning',
              builder: (context, params) => params.isEmpty
                  ? NavBarPage(initialPage: 'myLearning')
                  : MyLearningWidget(),
            ),
            FFRoute(
              name: 'addCourse',
              path: 'addCourse',
              builder: (context, params) => AddCourseWidget(
                courseId: params.getParam('courseId', ParamType.String),
              ),
            ),
            FFRoute(
              name: 'addQuizStep1',
              path: 'addQuizStep1',
              builder: (context, params) => AddQuizStep1Widget(
                courseId: params.getParam('courseId', ParamType.String),
              ),
            )
          ].map((r) => r.toRoute(appStateNotifier)).toList(),
        ).toRoute(appStateNotifier),
      ],
      urlPathStrategy: UrlPathStrategy.path,
    );

extension NavParamExtensions on Map<String, String?> {
  Map<String, String> get withoutNulls => Map.fromEntries(
        entries
            .where((e) => e.value != null)
            .map((e) => MapEntry(e.key, e.value!)),
      );
}

extension _GoRouterStateExtensions on GoRouterState {
  Map<String, dynamic> get extraMap =>
      extra != null ? extra as Map<String, dynamic> : {};
  Map<String, dynamic> get allParams => <String, dynamic>{}
    ..addAll(params)
    ..addAll(queryParams)
    ..addAll(extraMap);
  TransitionInfo get transitionInfo => extraMap.containsKey(kTransitionInfoKey)
      ? extraMap[kTransitionInfoKey] as TransitionInfo
      : TransitionInfo.appDefault();
}

class FFParameters {
  FFParameters(this.state, [this.asyncParams = const {}]);

  final GoRouterState state;
  final Map<String, Future<dynamic> Function(String)> asyncParams;

  Map<String, dynamic> futureParamValues = {};

  // Parameters are empty if the params map is empty or if the only parameter
  // present is the special extra parameter reserved for the transition info.
  bool get isEmpty =>
      state.allParams.isEmpty ||
      (state.extraMap.length == 1 &&
          state.extraMap.containsKey(kTransitionInfoKey));
  bool isAsyncParam(MapEntry<String, dynamic> param) =>
      asyncParams.containsKey(param.key) && param.value is String;
  bool get hasFutures => state.allParams.entries.any(isAsyncParam);
  Future<bool> completeFutures() => Future.wait(
        state.allParams.entries.where(isAsyncParam).map(
          (param) async {
            final doc = await asyncParams[param.key]!(param.value)
                .onError((_, __) => null);
            if (doc != null) {
              futureParamValues[param.key] = doc;
              return true;
            }
            return false;
          },
        ),
      ).onError((_, __) => [false]).then((v) => v.every((e) => e));

  dynamic getParam<T>(
    String paramName,
    ParamType type, [
    bool isList = false,
  ]) {
    if (futureParamValues.containsKey(paramName)) {
      return futureParamValues[paramName];
    }
    if (!state.allParams.containsKey(paramName)) {
      return null;
    }
    final param = state.allParams[paramName];
    // Got parameter from `extras`, so just directly return it.
    if (param is! String) {
      return param;
    }
    // Return serialized value.
    return deserializeParam<T>(
      param,
      type,
      isList,
    );
  }
}

class FFRoute {
  const FFRoute({
    required this.name,
    required this.path,
    required this.builder,
    this.requireAuth = false,
    this.asyncParams = const {},
    this.routes = const [],
  });

  final String name;
  final String path;
  final bool requireAuth;
  final Map<String, Future<dynamic> Function(String)> asyncParams;
  final Widget Function(BuildContext, FFParameters) builder;
  final List<GoRoute> routes;

  GoRoute toRoute(AppStateNotifier appStateNotifier) => GoRoute(
        name: name,
        path: path,
        pageBuilder: (context, state) {
          final ffParams = FFParameters(state, asyncParams);
          final page = ffParams.hasFutures
              ? FutureBuilder(
                  future: ffParams.completeFutures(),
                  builder: (context, _) => builder(context, ffParams),
                )
              : builder(context, ffParams);
          final child = page;

          final transitionInfo = state.transitionInfo;
          return transitionInfo.hasTransition
              ? CustomTransitionPage(
                  key: state.pageKey,
                  child: child,
                  transitionDuration: transitionInfo.duration,
                  transitionsBuilder: PageTransition(
                    type: transitionInfo.transitionType,
                    duration: transitionInfo.duration,
                    reverseDuration: transitionInfo.duration,
                    alignment: transitionInfo.alignment,
                    child: child,
                  ).transitionsBuilder,
                )
              : MaterialPage(key: state.pageKey, child: child);
        },
        routes: routes,
      );
}

class TransitionInfo {
  const TransitionInfo({
    required this.hasTransition,
    this.transitionType = PageTransitionType.fade,
    this.duration = const Duration(milliseconds: 300),
    this.alignment,
  });

  final bool hasTransition;
  final PageTransitionType transitionType;
  final Duration duration;
  final Alignment? alignment;

  static TransitionInfo appDefault() => TransitionInfo(hasTransition: false);
}
