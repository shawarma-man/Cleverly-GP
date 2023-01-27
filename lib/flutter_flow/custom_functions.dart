import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';

bool? hasMatch(
  List<String>? listTosearch,
  String? searchTerm,
) {
  return listTosearch?.contains(searchTerm);
}

int incOrDec(
  bool inc,
  int num,
) {
  if (inc) {
    return num + 1;
  } else {
    return num - 1;
  }
}

dynamic convertToJson(
  String name,
  String description,
  String thumbnail,
) {
  dynamic jsonMap = {
    "name": name,
    "description": description,
    "thumbnail": thumbnail
  };
  return jsonMap;
}

int formFieldRepeater(List<int>? fieldCount) {
  return (fieldCount!.last + 1);
}

dynamic convertToQsArr(
  String question,
  String choice1,
  String choice2,
  String choice3,
  String choice4,
  String answer,
) {
  List<String> choices = [choice1, choice2, choice3, choice4];
  dynamic jsonMap = {"q": question, "choices": choices, "answer": answer};
  return jsonMap;
}

String jsonToString(List<dynamic> jsonList) {
  return json.encode(jsonList);
}

bool hasMatchJson(
  List<dynamic> jsonL,
  String? id,
) {
  if (jsonL == null || jsonL.isEmpty) return false;
  return jsonL.any((student) => student["_id"] == id);
}

String? last4(String? sha) {
  if (sha == null) return "1234";
  return sha.substring(sha.length - 4);
}
