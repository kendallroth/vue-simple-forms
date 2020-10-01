# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Removed
- Removed the `FormCreateMixin` (replaced with typed `createForm` function)
  - _The `FormCreaetMixin` (not truly a mixin...) did not work with TypeScript_
  - _The old mixin simply called this function anyway..._
- Removed the `FormLeaveGuardMixin` (replaced with typed `FormGuardMixin`)
  - _The `FormLeaveGuardMixin` (not truly a mixin...) did not work with TypeScript_
  - _There was no need for customizing the leave guard to the extend provided_
- Removed the form key/name from the `createForm` function API
  - _This was an unnecessary step that caused more internal work for no gain (simply assign to data)_

### Changed
- Changed the default behaviour of the `setValues` form function (now will not set initial values by default)
  - _This change was made to align with developer expectations (behaviour moved to `setInitial`)_

### Added
- Overhauled package to use [TypeScript](https://typescriptlang.org)!
- Fully typed `FormGuardMixin` to replace `FormLeaveGuardMixin` (can be customized with `formGuards` data key)
- New `setInitial` form function to set a form's initial (and current) values (similar to old behaviour of `setValues`)

## [0.2.3] - 2020-09-30
### Added
- Development instructions and guide

### Removed
- Removed duplicated `npm-test` step from publish Action

## [0.2.2] - 2020-07-01
### Added
- GitLab testing and release pipeline (#1)
- Test suite implementation and coverage tests (#1)

### Fixed
- Only allow setting form flags that have been defined (#1)

## [0.2.1] - 2020-06-30
### Fixed
- Reset form data when leaving route in `FormLeaveGuardMixin`

## [0.2.0] - 2020-06-30
### Added
- New `FormLeaveGuardMixin` to prevent users from leaving routes with unsaved changes
  - **Does require additional handling (via dialog, etc)**
- New `FormCreateMixin` based on the existing `createForm` function
- Customization options to the form creation function/mixin
  - Can specify custom `flags` and whether the `changed` flag should be calculated (performance)

### Changed
-  Changed `createForm` to a secondary export (instead prefer `FormCreateMixin`)

## [0.1.0] - 2020-06-29
### Added
- Core `createForm` function to create reactive Vue form data/flags
- Basic project (dummy) tests
- Initial project documentation/setup
