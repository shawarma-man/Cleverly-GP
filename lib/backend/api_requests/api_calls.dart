import 'dart:convert';
import 'dart:typed_data';

import '../../flutter_flow/flutter_flow_util.dart';

import 'api_manager.dart';

export 'api_manager.dart' show ApiCallResponse;

const _kPrivateApiFunctionName = 'ffPrivateApiCall';

/// Start API base Group Code

class APIBaseGroup {
  static String baseUrl = 'https://polar-waters-85807.herokuapp.com';
  static Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate, br',
  };
  static LoginCall loginCall = LoginCall();
  static SignUpCall signUpCall = SignUpCall();
  static SendVerificationEmailCall sendVerificationEmailCall =
      SendVerificationEmailCall();
  static RequestPasswordResetCodeCall requestPasswordResetCodeCall =
      RequestPasswordResetCodeCall();
  static VerifyPinCodeCall verifyPinCodeCall = VerifyPinCodeCall();
  static ResetPasswordCall resetPasswordCall = ResetPasswordCall();
}

class LoginCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? password = '',
  }) {
    final body = '''
{
  "email": "${email}",
  "password": "${password}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Login',
      apiUrl: '${APIBaseGroup.baseUrl}/api/sessions',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic accessToken(dynamic response) => getJsonField(
        response,
        r'''$.accessToken''',
      );
  dynamic refreshToken(dynamic response) => getJsonField(
        response,
        r'''$.refreshToken''',
      );
  dynamic messege(dynamic response) => getJsonField(
        response,
        r'''$.messege''',
      );
}

class SignUpCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? username = '',
    String? password = '',
    String? passwordConfirmation = '',
    String? firstname = '',
    String? lastname = '',
  }) {
    final body = '''
{
  "email": "${email}",
  "password": "${password}",
  "passwordConfirmation": "${passwordConfirmation}",
  "username": "${username}",
  "type": "student",
  "firstName": "${firstname}",
  "lastName": "${lastname}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Sign up',
      apiUrl: '${APIBaseGroup.baseUrl}/api/users',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic global(dynamic response) => getJsonField(
        response,
        r'''$''',
      );
  dynamic email(dynamic response) => getJsonField(
        response,
        r'''$.email''',
      );
  dynamic messege(dynamic response) => getJsonField(
        response,
        r'''$.message''',
      );
}

class SendVerificationEmailCall {
  Future<ApiCallResponse> call({
    String? email = '',
  }) {
    final body = '''
{
  "email": "${email}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Send verification email',
      apiUrl: '${APIBaseGroup.baseUrl}/api/users/email/send',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic messege(dynamic response) => getJsonField(
        response,
        r'''$.message''',
      );
}

class RequestPasswordResetCodeCall {
  Future<ApiCallResponse> call({
    String? email = '',
  }) {
    final body = '''
{
  "email": "${email}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Request password reset code',
      apiUrl: '${APIBaseGroup.baseUrl}/api/users/password/send',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic messege(dynamic response) => getJsonField(
        response,
        r'''$.message''',
      );
}

class VerifyPinCodeCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? token = '',
  }) {
    final body = '''
{
  "email": "${email}",
  "resetToken": "${token}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Verify PinCode',
      apiUrl: '${APIBaseGroup.baseUrl}/api/users/password/verify',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic message(dynamic response) => getJsonField(
        response,
        r'''$.message''',
      );
}

class ResetPasswordCall {
  Future<ApiCallResponse> call({
    String? email = '',
    String? password = '',
    String? passwordConfirm = '',
    String? token = '',
  }) {
    final body = '''
{
  "email": "${email}",
  "password": "${password}",
  "passwordConfirmation": "${passwordConfirm}",
  "resetToken": "${token}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Reset Password',
      apiUrl: '${APIBaseGroup.baseUrl}/api/users/password/reset',
      callType: ApiCallType.POST,
      headers: {
        ...APIBaseGroup.headers,
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic message(dynamic response) => getJsonField(
        response,
        r'''$.message''',
      );
}

/// End API base Group Code

/// Start Authorized actions Group Code

class AuthorizedActionsGroup {
  static String baseUrl = 'https://polar-waters-85807.herokuapp.com';
  static Map<String, String> headers = {};
  static GetRecommendationsCall getRecommendationsCall =
      GetRecommendationsCall();
  static GetUsersCall getUsersCall = GetUsersCall();
  static LogOutCall logOutCall = LogOutCall();
  static GetProfileCall getProfileCall = GetProfileCall();
  static AddCardCall addCardCall = AddCardCall();
  static GetTopCoursesCall getTopCoursesCall = GetTopCoursesCall();
  static GetTryNewCoursesCall getTryNewCoursesCall = GetTryNewCoursesCall();
  static GetCoursesByInstructorCall getCoursesByInstructorCall =
      GetCoursesByInstructorCall();
  static GetQuizCall getQuizCall = GetQuizCall();
  static SearchCall searchCall = SearchCall();
  static DeleteCourseCall deleteCourseCall = DeleteCourseCall();
  static AddDiscountCall addDiscountCall = AddDiscountCall();
  static UploadAVideoCall uploadAVideoCall = UploadAVideoCall();
  static SubmitQuizCall submitQuizCall = SubmitQuizCall();
  static AddQuizCall addQuizCall = AddQuizCall();
  static ReviewCourseCall reviewCourseCall = ReviewCourseCall();
  static CreateCourseCall createCourseCall = CreateCourseCall();
  static UpdateUserCall updateUserCall = UpdateUserCall();
  static GetCourseByIDCall getCourseByIDCall = GetCourseByIDCall();
  static GetQuizSubmissionsCall getQuizSubmissionsCall =
      GetQuizSubmissionsCall();
  static GetMyScoreCall getMyScoreCall = GetMyScoreCall();
  static GetQuizByIdCall getQuizByIdCall = GetQuizByIdCall();
  static AddToCartCall addToCartCall = AddToCartCall();
  static GetCartCall getCartCall = GetCartCall();
  static RemoveFromCartCall removeFromCartCall = RemoveFromCartCall();
  static CheckoutCall checkoutCall = CheckoutCall();
  static UpdateCourseCall updateCourseCall = UpdateCourseCall();
  static ChangePasswordCall changePasswordCall = ChangePasswordCall();
  static AddCourseCall addCourseCall = AddCourseCall();
  static AddQuestionToQuizCall addQuestionToQuizCall = AddQuestionToQuizCall();
}

class GetRecommendationsCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Recommendations',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/recommendations',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic recommendations(dynamic response) => getJsonField(
        response,
        r'''$''',
      );
}

class GetUsersCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Users',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class LogOutCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Log Out',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/sessions',
      callType: ApiCallType.DELETE,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetProfileCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Profile',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users/profile/get',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic id(dynamic response) => getJsonField(
        response,
        r'''$._id''',
      );
  dynamic email(dynamic response) => getJsonField(
        response,
        r'''$.email''',
      );
  dynamic username(dynamic response) => getJsonField(
        response,
        r'''$.username''',
      );
  dynamic firstname(dynamic response) => getJsonField(
        response,
        r'''$.firstName''',
      );
  dynamic lastname(dynamic response) => getJsonField(
        response,
        r'''$.lastName''',
      );
  dynamic card(dynamic response) => getJsonField(
        response,
        r'''$.card''',
      );
  dynamic profilePic(dynamic response) => getJsonField(
        response,
        r'''$.profilePic''',
      );
  dynamic type(dynamic response) => getJsonField(
        response,
        r'''$.type''',
      );
  dynamic owned(dynamic response) => getJsonField(
        response,
        r'''$.ownedCourses''',
        true,
      );
  dynamic published(dynamic response) => getJsonField(
        response,
        r'''$.publishedCourses''',
        true,
      );
  dynamic cardNumber(dynamic response) => getJsonField(
        response,
        r'''$.card.CardNumber''',
      );
  dynamic expiryDate(dynamic response) => getJsonField(
        response,
        r'''$.card.expiryDate''',
      );
  dynamic cardHolder(dynamic response) => getJsonField(
        response,
        r'''$.card.CardHolder''',
      );
  dynamic cvv(dynamic response) => getJsonField(
        response,
        r'''$.card.cvv''',
      );
}

class AddCardCall {
  Future<ApiCallResponse> call({
    int? number,
    String? name = '',
    String? date = '',
    int? cvv,
    String? authToken = '',
  }) {
    final body = '''
{
  "CardNumber": ${number},
  "expiryDate": "${date}",
  "cvv": ${cvv},
  "CardHolder": "${name}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add card',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users/card/add',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetTopCoursesCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get top courses',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/topCourses',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetTryNewCoursesCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Try new courses',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/tryCourses',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetCoursesByInstructorCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? id = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Courses By instructor',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/instructor/${id}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {
        'id': id,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetQuizCall {
  Future<ApiCallResponse> call({
    String? course = '',
    String? quiz = '',
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Quiz',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {
        'course': course,
        'quiz': quiz,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic submissionIds(dynamic response) => getJsonField(
        response,
        r'''$.submissions[:]._id''',
        true,
      );
  dynamic id(dynamic response) => getJsonField(
        response,
        r'''$._id''',
      );
  dynamic submissions(dynamic response) => getJsonField(
        response,
        r'''$.submissions''',
        true,
      );
}

class SearchCall {
  Future<ApiCallResponse> call({
    String? search = '',
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Search',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/search/${search}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'authorization': 'Bearer ${authToken}',
      },
      params: {
        'search': search,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class DeleteCourseCall {
  Future<ApiCallResponse> call({
    String? course = '',
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Delete Course',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}',
      callType: ApiCallType.DELETE,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {
        'course': course,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class AddDiscountCall {
  Future<ApiCallResponse> call({
    int? dis,
    String? code = '',
    String? authToken = '',
    String? id = '',
  }) {
    final body = '''
{
  "code": "${code}",
  "discount": ${dis}
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add discount',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${id}/discount',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class UploadAVideoCall {
  Future<ApiCallResponse> call({
    FFLocalFile? file,
    dynamic? infoJson,
    String? id = '',
    String? authToken = '',
  }) {
    final info = _serializeJson(infoJson);

    return ApiManager.instance.makeApiCall(
      callName: 'Upload A video',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${id}/videos',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {
        'file': file,
        'info': info,
      },
      bodyType: BodyType.MULTIPART,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class SubmitQuizCall {
  Future<ApiCallResponse> call({
    List<String>? answersList,
    String? course = '',
    String? quiz = '',
    String? authToken = '',
  }) {
    final answers = _serializeList(answersList);

    final body = '''
${answers}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Submit Quiz',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}/submit',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class AddQuizCall {
  Future<ApiCallResponse> call({
    String? name = '',
    String? description = '',
    dynamic? questionsJson,
    String? id = '',
    String? authToken = '',
  }) {
    final questions = _serializeJson(questionsJson);
    final body = '''
{
  "name": "${name}",
  "description": "${description}",
  "questions": []
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add Quiz',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${id}/quiz',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class ReviewCourseCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? id = '',
    int? rating,
    String? comment = '',
  }) {
    final body = '''
{
  "rating": ${rating},
  "comment": "${comment}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Review Course',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${id}/review',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class CreateCourseCall {
  Future<ApiCallResponse> call({
    String? name = '',
    int? price,
    String? description = '',
    String? category = '',
    String? thumbnail = '',
    String? authToken = '',
  }) {
    final body = '''
{
  "name": "${name}",
  "description": "${description}",
  "price": ${price},
  "category": "${category}",
  "thumbnail": "${thumbnail}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Create Course',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class UpdateUserCall {
  Future<ApiCallResponse> call({
    String? username = '',
    String? bio = '',
    String? profilePic = '',
    String? firstname = '',
    String? lastname = '',
    String? authToken = '',
  }) {
    final body = '''
{
  "username": "${username}",
  "bio": "${bio}",
  "profilePic": "${profilePic}",
  "firstName": "${firstname}",
  "lastName": "${lastname}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Update User',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users/update',
      callType: ApiCallType.PATCH,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetCourseByIDCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? id = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Course by ID',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${id}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic name(dynamic response) => getJsonField(
        response,
        r'''$.name''',
      );
  dynamic description(dynamic response) => getJsonField(
        response,
        r'''$.description''',
      );
  dynamic price(dynamic response) => getJsonField(
        response,
        r'''$.price''',
      );
  dynamic rating(dynamic response) => getJsonField(
        response,
        r'''$.rating''',
      );
  dynamic instID(dynamic response) => getJsonField(
        response,
        r'''$.instructor._id''',
      );
  dynamic quizes(dynamic response) => getJsonField(
        response,
        r'''$.quizes''',
        true,
      );
  dynamic studentCount(dynamic response) => getJsonField(
        response,
        r'''$.students_count''',
      );
  dynamic reviews(dynamic response) => getJsonField(
        response,
        r'''$.reviews''',
        true,
      );
  dynamic category(dynamic response) => getJsonField(
        response,
        r'''$.category''',
      );
  dynamic thumbnail(dynamic response) => getJsonField(
        response,
        r'''$.thumbnail''',
      );
  dynamic submissions(dynamic response) => getJsonField(
        response,
        r'''$.quizes[:].submissions''',
        true,
      );
  dynamic submissionsIds(dynamic response) => getJsonField(
        response,
        r'''$.quizes[:].submissions[:]._id''',
        true,
      );
  dynamic students(dynamic response) => getJsonField(
        response,
        r'''$.students''',
        true,
      );
  dynamic studentsId(dynamic response) => getJsonField(
        response,
        r'''$.students[:]._id''',
        true,
      );
  dynamic reviewsIDs(dynamic response) => getJsonField(
        response,
        r'''$.reviews[:]._id''',
        true,
      );
}

class GetQuizSubmissionsCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? course = '',
    String? quiz = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Quiz Submissions',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}/submissions',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic id(dynamic response) => getJsonField(
        response,
        r'''$[:]._id''',
      );
  dynamic username(dynamic response) => getJsonField(
        response,
        r'''$[:].username''',
      );
  dynamic score(dynamic response) => getJsonField(
        response,
        r'''$[:].score''',
      );
  dynamic answers(dynamic response) => getJsonField(
        response,
        r'''$[:].answers''',
        true,
      );
}

class GetMyScoreCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? course = '',
    String? quiz = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get my score',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}/score',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic id(dynamic response) => getJsonField(
        response,
        r'''$._id''',
      );
  dynamic username(dynamic response) => getJsonField(
        response,
        r'''$.username''',
      );
  dynamic score(dynamic response) => getJsonField(
        response,
        r'''$.score''',
      );
  dynamic answers(dynamic response) => getJsonField(
        response,
        r'''$.answers''',
        true,
      );
}

class GetQuizByIdCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? course = '',
    String? quiz = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get Quiz By Id',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic name(dynamic response) => getJsonField(
        response,
        r'''$.name''',
      );
  dynamic description(dynamic response) => getJsonField(
        response,
        r'''$.description''',
      );
  dynamic numQ(dynamic response) => getJsonField(
        response,
        r'''$.num_questions''',
      );
  dynamic qsArr(dynamic response) => getJsonField(
        response,
        r'''$.questions''',
        true,
      );
  dynamic qsID(dynamic response) => getJsonField(
        response,
        r'''$.questions[:]._id''',
        true,
      );
  dynamic qsAns(dynamic response) => getJsonField(
        response,
        r'''$.questions[:].answer''',
        true,
      );
  dynamic qsCh(dynamic response) => getJsonField(
        response,
        r'''$.questions[:].choices''',
        true,
      );
  dynamic qs(dynamic response) => getJsonField(
        response,
        r'''$.questions[:].q''',
        true,
      );
}

class AddToCartCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? course = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Add to cart',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users/cart/add/${course}',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      bodyType: BodyType.NONE,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class GetCartCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? dis = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Get cart',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/users/cart/get?discount=${dis}',
      callType: ApiCallType.GET,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }

  dynamic cartList(dynamic response) => getJsonField(
        response,
        r'''$.cart''',
        true,
      );
  dynamic cartIds(dynamic response) => getJsonField(
        response,
        r'''$.cart[:]._id''',
      );
  dynamic cartName(dynamic response) => getJsonField(
        response,
        r'''$.cart[:].name''',
      );
  dynamic price(dynamic response) => getJsonField(
        response,
        r'''$.cart[:].price''',
      );
  dynamic thumbnail(dynamic response) => getJsonField(
        response,
        r'''$.cart[:].thumbnail''',
      );
  dynamic category(dynamic response) => getJsonField(
        response,
        r'''$.cart[:].category''',
      );
  dynamic discount(dynamic response) => getJsonField(
        response,
        r'''$.cart[:].discounts''',
        true,
      );
  dynamic totalPrice(dynamic response) => getJsonField(
        response,
        r'''$.totalPrice''',
      );
}

class RemoveFromCartCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? course = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'remove from cart',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/users/cart/remove/${course}',
      callType: ApiCallType.DELETE,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {
        'course': course,
        'auth_token': authToken,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class CheckoutCall {
  Future<ApiCallResponse> call({
    String? dis = '',
    String? authToken = '',
  }) {
    return ApiManager.instance.makeApiCall(
      callName: 'Checkout',
      apiUrl:
          '${AuthorizedActionsGroup.baseUrl}/api/users/cart/checkout?discount=${dis}',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      bodyType: BodyType.NONE,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class UpdateCourseCall {
  Future<ApiCallResponse> call({
    String? name = '',
    String? thumbnail = '',
    String? category = '',
    String? description = '',
    String? authToken = '',
    String? course = '',
  }) {
    final body = '''
{
  "name": "${name}",
  "thumbnail": "${thumbnail}",
  "description": "${description}",
  "category": "${category}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'update course',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}',
      callType: ApiCallType.PATCH,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class ChangePasswordCall {
  Future<ApiCallResponse> call({
    String? authToken = '',
    String? oldPass = '',
    String? newPass = '',
  }) {
    final body = '''
{
  "oldPassword": "${oldPass}",
  "newPassword": "${newPass}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Change password',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/users/password',
      callType: ApiCallType.PATCH,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class AddCourseCall {
  Future<ApiCallResponse> call({
    String? desc = '',
    String? name = '',
    int? price,
    String? category = '',
    String? thumbnail = '',
    String? authToken = '',
  }) {
    final body = '''
{
  "name": "${name}",
  "description": "${desc}",
  "price": ${price},
  "category": "${category}",
  "thumbnail": "${thumbnail}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add course',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/',
      callType: ApiCallType.POST,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class AddQuestionToQuizCall {
  Future<ApiCallResponse> call({
    String? q = '',
    String? ch1 = '',
    String? ch2 = '',
    String? ch3 = '',
    String? ch4 = '',
    String? answer = '',
    String? authToken = '',
    String? course = '',
    String? quiz = '',
  }) {
    final body = '''
{
  "q": "${q}",
  "choices": [
    "${ch1}",
    "${ch2}",
    "${ch3}",
    "${ch4}"
  ],
  "answer": "${answer}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Add question to quiz',
      apiUrl: '${AuthorizedActionsGroup.baseUrl}/api/courses/${course}/${quiz}',
      callType: ApiCallType.PATCH,
      headers: {
        ...AuthorizedActionsGroup.headers,
        'Authorization': 'Bearer ${authToken}',
      },
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

/// End Authorized actions Group Code

class CreateAccountCall {
  static Future<ApiCallResponse> call() {
    final body = '''
{
    "email": "test@gmail.com",
    "password": "123654",
    "passwordConfirmation": "123654",
    "username": "test",
    "type" : "student",
    "firstName": "testF",
    "lastName": "testL"

}''';
    return ApiManager.instance.makeApiCall(
      callName: 'Create Account',
      apiUrl: 'https://polar-waters-85807.herokuapp.com/api/users',
      callType: ApiCallType.POST,
      headers: {},
      params: {},
      body: body,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
    );
  }
}

class ApiPagingParams {
  int nextPageNumber = 0;
  int numItems = 0;
  dynamic lastResponse;

  ApiPagingParams({
    required this.nextPageNumber,
    required this.numItems,
    required this.lastResponse,
  });

  @override
  String toString() =>
      'PagingParams(nextPageNumber: $nextPageNumber, numItems: $numItems, lastResponse: $lastResponse,)';
}

String _serializeList(List? list) {
  list ??= <String>[];
  try {
    return json.encode(list);
  } catch (_) {
    return '[]';
  }
}

String _serializeJson(dynamic jsonVar) {
  jsonVar ??= {};
  try {
    return json.encode(jsonVar);
  } catch (_) {
    return '{}';
  }
}
