# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
