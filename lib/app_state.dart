import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:csv/csv.dart';
import 'flutter_flow/lat_lng.dart';
import 'dart:convert';

class FFAppState extends ChangeNotifier {
  static final FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal() {
    initializePersistedState();
  }

  Future initializePersistedState() async {
    secureStorage = FlutterSecureStorage();
    _token = await secureStorage.getString('ff_token') ?? _token;
    _id = await secureStorage.getString('ff_id') ?? _id;
    _answers = await secureStorage.getStringList('ff_answers') ?? _answers;
    _qList = (await secureStorage.getStringList('ff_qList'))?.map((x) {
          try {
            return jsonDecode(x);
          } catch (e) {
            print("Can't decode persisted json. Error: $e.");
            return {};
          }
        }).toList() ??
        _qList;
  }

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  late FlutterSecureStorage secureStorage;

  String _token = '';
  String get token => _token;
  set token(String _value) {
    _token = _value;
    secureStorage.setString('ff_token', _value);
  }

  void deleteToken() {
    secureStorage.delete(key: 'ff_token');
  }

  String _id = '';
  String get id => _id;
  set id(String _value) {
    _id = _value;
    secureStorage.setString('ff_id', _value);
  }

  void deleteId() {
    secureStorage.delete(key: 'ff_id');
  }

  List<String> _answers = [];
  List<String> get answers => _answers;
  set answers(List<String> _value) {
    _answers = _value;
    secureStorage.setStringList('ff_answers', _value);
  }

  void deleteAnswers() {
    secureStorage.delete(key: 'ff_answers');
  }

  void addToAnswers(String _value) {
    _answers.add(_value);
    secureStorage.setStringList('ff_answers', _answers);
  }

  void removeFromAnswers(String _value) {
    _answers.remove(_value);
    secureStorage.setStringList('ff_answers', _answers);
  }

  List<dynamic> _qList = [];
  List<dynamic> get qList => _qList;
  set qList(List<dynamic> _value) {
    _qList = _value;
    secureStorage.setStringList(
        'ff_qList', _value.map((x) => jsonEncode(x)).toList());
  }

  void deleteQList() {
    secureStorage.delete(key: 'ff_qList');
  }

  void addToQList(dynamic _value) {
    _qList.add(_value);
    secureStorage.setStringList(
        'ff_qList', _qList.map((x) => jsonEncode(x)).toList());
  }

  void removeFromQList(dynamic _value) {
    _qList.remove(_value);
    secureStorage.setStringList(
        'ff_qList', _qList.map((x) => jsonEncode(x)).toList());
  }

  List<int> _FieldNum = [0];
  List<int> get FieldNum => _FieldNum;
  set FieldNum(List<int> _value) {
    _FieldNum = _value;
  }

  void addToFieldNum(int _value) {
    _FieldNum.add(_value);
  }

  void removeFromFieldNum(int _value) {
    _FieldNum.remove(_value);
  }

  dynamic _alt;
  dynamic get alt => _alt;
  set alt(dynamic _value) {
    _alt = _value;
  }

  List<String> _StudentId = [];
  List<String> get StudentId => _StudentId;
  set StudentId(List<String> _value) {
    _StudentId = _value;
  }

  void addToStudentId(String _value) {
    _StudentId.add(_value);
  }

  void removeFromStudentId(String _value) {
    _StudentId.remove(_value);
  }

  List<String> _quizstudentId = [];
  List<String> get quizstudentId => _quizstudentId;
  set quizstudentId(List<String> _value) {
    _quizstudentId = _value;
  }

  void addToQuizstudentId(String _value) {
    _quizstudentId.add(_value);
  }

  void removeFromQuizstudentId(String _value) {
    _quizstudentId.remove(_value);
  }
}

LatLng? _latLngFromString(String? val) {
  if (val == null) {
    return null;
  }
  final split = val.split(',');
  final lat = double.parse(split.first);
  final lng = double.parse(split.last);
  return LatLng(lat, lng);
}

extension FlutterSecureStorageExtensions on FlutterSecureStorage {
  void remove(String key) => delete(key: key);

  Future<String?> getString(String key) async => await read(key: key);
  Future<void> setString(String key, String value) async =>
      await write(key: key, value: value);

  Future<bool?> getBool(String key) async => (await read(key: key)) == 'true';
  Future<void> setBool(String key, bool value) async =>
      await write(key: key, value: value.toString());

  Future<int?> getInt(String key) async =>
      int.tryParse(await read(key: key) ?? '');
  Future<void> setInt(String key, int value) async =>
      await write(key: key, value: value.toString());

  Future<double?> getDouble(String key) async =>
      double.tryParse(await read(key: key) ?? '');
  Future<void> setDouble(String key, double value) async =>
      await write(key: key, value: value.toString());

  Future<List<String>?> getStringList(String key) async =>
      await read(key: key).then((result) {
        if (result == null || result.isEmpty) {
          return null;
        }
        return CsvToListConverter()
            .convert(result)
            .first
            .map((e) => e.toString())
            .toList();
      });
  Future<void> setStringList(String key, List<String> value) async =>
      await write(key: key, value: ListToCsvConverter().convert([value]));
}
