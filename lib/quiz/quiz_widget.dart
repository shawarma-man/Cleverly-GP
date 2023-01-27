import '../backend/api_requests/api_calls.dart';
import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import '../flutter_flow/custom_functions.dart' as functions;
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:provider/provider.dart';

class QuizWidget extends StatefulWidget {
  const QuizWidget({
    Key? key,
    this.quizId,
    this.courseId,
    this.answers,
  }) : super(key: key);

  final String? quizId;
  final String? courseId;
  final String? answers;

  @override
  _QuizWidgetState createState() => _QuizWidgetState();
}

class _QuizWidgetState extends State<QuizWidget> {
  ApiCallResponse? apiResult7jb;
  PageController? pageViewController;
  final _unfocusNode = FocusNode();
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void dispose() {
    _unfocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return FutureBuilder<ApiCallResponse>(
      future: AuthorizedActionsGroup.getQuizByIdCall.call(
        authToken: FFAppState().token,
        course: widget.courseId,
        quiz: widget.quizId,
      ),
      builder: (context, snapshot) {
        // Customize what your widget looks like when it's loading.
        if (!snapshot.hasData) {
          return Center(
            child: SizedBox(
              width: 40,
              height: 40,
              child: SpinKitThreeBounce(
                color: FlutterFlowTheme.of(context).flame,
                size: 40,
              ),
            ),
          );
        }
        final quizGetQuizByIdResponse = snapshot.data!;
        return Scaffold(
          key: scaffoldKey,
          backgroundColor: Color(0xFFF1F4F8),
          appBar: AppBar(
            backgroundColor: FlutterFlowTheme.of(context).darkText,
            automaticallyImplyLeading: false,
            leading: InkWell(
              onTap: () async {
                context.pop();
              },
              child: Icon(
                Icons.chevron_left_rounded,
                color: FlutterFlowTheme.of(context).white,
                size: 32,
              ),
            ),
            title: Text(
              AuthorizedActionsGroup.getQuizByIdCall
                  .name(
                    quizGetQuizByIdResponse.jsonBody,
                  )
                  .toString(),
              style: FlutterFlowTheme.of(context).title2.override(
                    fontFamily: 'Outfit',
                    color: FlutterFlowTheme.of(context).white,
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                  ),
            ),
            actions: [],
            centerTitle: false,
            elevation: 0,
          ),
          body: SafeArea(
            child: GestureDetector(
              onTap: () => FocusScope.of(context).requestFocus(_unfocusNode),
              child: Builder(
                builder: (context) {
                  final quiz = AuthorizedActionsGroup.getQuizByIdCall
                          .qsArr(
                            quizGetQuizByIdResponse.jsonBody,
                          )
                          ?.toList() ??
                      [];
                  return Container(
                    width: double.infinity,
                    height: MediaQuery.of(context).size.height * 0.9,
                    child: Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 50),
                      child: PageView.builder(
                        controller: pageViewController ??= PageController(
                            initialPage: min(0, quiz.length - 1)),
                        scrollDirection: Axis.horizontal,
                        itemCount: quiz.length,
                        itemBuilder: (context, quizIndex) {
                          final quizItem = quiz[quizIndex];
                          return Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Expanded(
                                child: SingleChildScrollView(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Align(
                                        alignment: AlignmentDirectional(-1, 0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16, 12, 0, 0),
                                          child: Text(
                                            'Question ${functions.incOrDec(true, quizIndex).toString()}/${AuthorizedActionsGroup.getQuizByIdCall.numQ(
                                                  quizGetQuizByIdResponse
                                                      .jsonBody,
                                                ).toString()}',
                                            style: FlutterFlowTheme.of(context)
                                                .bodyText2
                                                .override(
                                                  fontFamily: 'Outfit',
                                                  color: Color(0xFF57636C),
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.normal,
                                                ),
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            12, 12, 12, 0),
                                        child: LinearPercentIndicator(
                                          percent: quizIndex /
                                              AuthorizedActionsGroup
                                                  .getQuizByIdCall
                                                  .numQ(
                                                quizGetQuizByIdResponse
                                                    .jsonBody,
                                              ),
                                          width: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.92,
                                          lineHeight: 12,
                                          animation: true,
                                          progressColor:
                                              FlutterFlowTheme.of(context)
                                                  .flame,
                                          backgroundColor: Color(0xFFE0E3E7),
                                          barRadius: Radius.circular(24),
                                          padding: EdgeInsets.zero,
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            16, 25, 0, 0),
                                        child: Text(
                                          'Q: ${getJsonField(
                                            quizItem,
                                            r'''$.q''',
                                          ).toString()}',
                                          style: FlutterFlowTheme.of(context)
                                              .title1
                                              .override(
                                                fontFamily: 'Outfit',
                                                color: Color(0xFF0F1113),
                                                fontSize: 28,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            16, 30, 16, 0),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.max,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceAround,
                                          children: [
                                            Expanded(
                                              child: Container(
                                                width: double.infinity,
                                                decoration: BoxDecoration(
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .white,
                                                  boxShadow: [
                                                    BoxShadow(
                                                      blurRadius: 5,
                                                      color: Color(0x3B1D2429),
                                                      offset: Offset(0, -3),
                                                    )
                                                  ],
                                                  borderRadius:
                                                      BorderRadius.circular(16),
                                                ),
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(20, 20, 20, 20),
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.max,
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    children: [
                                                      Builder(
                                                        builder: (context) {
                                                          final choices =
                                                              getJsonField(
                                                            quizItem,
                                                            r'''$.choices''',
                                                          )
                                                                  .toList()
                                                                  .take(4)
                                                                  .toList();
                                                          return ListView
                                                              .builder(
                                                            padding:
                                                                EdgeInsets.zero,
                                                            shrinkWrap: true,
                                                            scrollDirection:
                                                                Axis.vertical,
                                                            itemCount:
                                                                choices.length,
                                                            itemBuilder: (context,
                                                                choicesIndex) {
                                                              final choicesItem =
                                                                  choices[
                                                                      choicesIndex];
                                                              return Padding(
                                                                padding:
                                                                    EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                            0,
                                                                            0,
                                                                            0,
                                                                            22),
                                                                child:
                                                                    FFButtonWidget(
                                                                  onPressed:
                                                                      () async {
                                                                    var _shouldSetState =
                                                                        false;
                                                                    FFAppState()
                                                                        .addToAnswers(
                                                                            getJsonField(
                                                                      choicesItem,
                                                                      r'''$''',
                                                                    ).toString());
                                                                    if (functions.incOrDec(
                                                                            true,
                                                                            quizIndex) ==
                                                                        AuthorizedActionsGroup
                                                                            .getQuizByIdCall
                                                                            .numQ(
                                                                          quizGetQuizByIdResponse
                                                                              .jsonBody,
                                                                        )) {
                                                                      apiResult7jb = await AuthorizedActionsGroup
                                                                          .submitQuizCall
                                                                          .call(
                                                                        course:
                                                                            widget.courseId,
                                                                        quiz: widget
                                                                            .quizId,
                                                                        authToken:
                                                                            FFAppState().token,
                                                                        answersList:
                                                                            FFAppState().answers,
                                                                      );
                                                                      _shouldSetState =
                                                                          true;
                                                                      if ((apiResult7jb
                                                                              ?.succeeded ??
                                                                          true)) {
                                                                        context
                                                                            .goNamed(
                                                                          'success',
                                                                          queryParams:
                                                                              {
                                                                            'message':
                                                                                serializeParam(
                                                                              'Quiz submitted Successfuly',
                                                                              ParamType.String,
                                                                            ),
                                                                            'courseDetails':
                                                                                serializeParam(
                                                                              widget.courseId,
                                                                              ParamType.String,
                                                                            ),
                                                                            'isCourse':
                                                                                serializeParam(
                                                                              true,
                                                                              ParamType.bool,
                                                                            ),
                                                                          }.withoutNulls,
                                                                          extra: <
                                                                              String,
                                                                              dynamic>{
                                                                            kTransitionInfoKey:
                                                                                TransitionInfo(
                                                                              hasTransition: true,
                                                                              transitionType: PageTransitionType.fade,
                                                                              duration: Duration(milliseconds: 300),
                                                                            ),
                                                                          },
                                                                        );
                                                                      } else {
                                                                        ScaffoldMessenger.of(context)
                                                                            .showSnackBar(
                                                                          SnackBar(
                                                                            content:
                                                                                Text(
                                                                              'Unexpected error occured',
                                                                              style: FlutterFlowTheme.of(context).subtitle1.override(
                                                                                    fontFamily: 'Poppins',
                                                                                    color: FlutterFlowTheme.of(context).floralWhite,
                                                                                    fontSize: 14,
                                                                                    fontWeight: FontWeight.normal,
                                                                                  ),
                                                                            ),
                                                                            duration:
                                                                                Duration(milliseconds: 4000),
                                                                            backgroundColor:
                                                                                FlutterFlowTheme.of(context).flame,
                                                                          ),
                                                                        );
                                                                        if (_shouldSetState)
                                                                          setState(
                                                                              () {});
                                                                        return;
                                                                      }

                                                                      if (_shouldSetState)
                                                                        setState(
                                                                            () {});
                                                                      return;
                                                                    } else {
                                                                      await pageViewController
                                                                          ?.nextPage(
                                                                        duration:
                                                                            Duration(milliseconds: 300),
                                                                        curve: Curves
                                                                            .ease,
                                                                      );
                                                                      if (_shouldSetState)
                                                                        setState(
                                                                            () {});
                                                                      return;
                                                                    }

                                                                    if (_shouldSetState)
                                                                      setState(
                                                                          () {});
                                                                  },
                                                                  text:
                                                                      '${choicesIndex.toString()}. ${getJsonField(
                                                                    choicesItem,
                                                                    r'''$''',
                                                                  ).toString()}',
                                                                  options:
                                                                      FFButtonOptions(
                                                                    width: double
                                                                        .infinity,
                                                                    height: 60,
                                                                    color: FlutterFlowTheme.of(
                                                                            context)
                                                                        .flame,
                                                                    textStyle: FlutterFlowTheme.of(
                                                                            context)
                                                                        .subtitle2
                                                                        .override(
                                                                          fontFamily:
                                                                              'Roboto',
                                                                          color:
                                                                              FlutterFlowTheme.of(context).white,
                                                                          fontSize:
                                                                              16,
                                                                          fontWeight:
                                                                              FontWeight.w500,
                                                                        ),
                                                                    borderSide:
                                                                        BorderSide(
                                                                      color: Colors
                                                                          .transparent,
                                                                      width: 1,
                                                                    ),
                                                                  ),
                                                                ),
                                                              );
                                                            },
                                                          );
                                                        },
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(0, 0),
                                child: Lottie.asset(
                                  'assets/lottie_animations/lf30_editor_dhtl29of.json',
                                  width: 180,
                                  height: 180,
                                  fit: BoxFit.cover,
                                  animate: true,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        );
      },
    );
  }
}
