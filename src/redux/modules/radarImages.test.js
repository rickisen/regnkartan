import { call, put } from 'redux-saga/effects'
import {fetchDay, FETCH_DAY, FETCH_DAY_SUCCESS} from './radarImages'

describe('fetchDay', () => {
  const day = new Date()
  const dd = day.getDate();
  const mm = day.getMonth() + 1; // January is 0!
  const yyyy = day.getFullYear()
  const generator = fetchDay({day})
  it('Should return the fetch call', () => {
    expect(generator.next().value).toEqual(call(() => fetch(API_URL + `${yyyy}/${mm}/${dd}` + '/?format=png').then((r) => r.json())))
  });
  // generator.next()
  // call(() => fetch(API_URL + `${yyyy}/${mm}/${dd}` + '/?format=png').then((r) => r.json()))
  it('Should return its success action', () => {
    expect(generator.next().value).toEqual(put({type: FETCH_DAY_SUCCESS, files: []}))
  });
})
